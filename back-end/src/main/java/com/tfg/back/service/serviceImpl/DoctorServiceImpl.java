package com.tfg.back.service.serviceImpl;

import static com.tfg.back.constants.ResponseMessages.*;
import com.tfg.back.enums.SearchType;
import com.tfg.back.exceptions.department.DepartmentNotFoundException;
import com.tfg.back.exceptions.user.IncorrectPasswordException;
import com.tfg.back.exceptions.user.UserAlreadyExistsException;
import com.tfg.back.exceptions.user.UserNotFoundException;
import com.tfg.back.mappers.DoctorMapper;
import com.tfg.back.model.*;
import com.tfg.back.model.dtos.doctor.*;
import com.tfg.back.model.dtos.users.ChangePasswordRequest;
import com.tfg.back.repository.AppointmentRepository;
import com.tfg.back.repository.DepartmentRepository;
import com.tfg.back.repository.DoctorRepository;
import com.tfg.back.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final DoctorMapper doctorMapper;
    private final AppointmentRepository appointmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Autowired
    public DoctorServiceImpl(DoctorRepository doctorRepository, DepartmentRepository departmentRepository, DoctorMapper doctorMapper, AppointmentRepository appointmentRepository, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.doctorRepository = doctorRepository;
        this.departmentRepository = departmentRepository;
        this.doctorMapper = doctorMapper;
        this.appointmentRepository = appointmentRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }


    //NOTE: Public Crud methods
    @Override
    public List<DoctorDtoGet> getAllDoctors() {
        return doctorMapper.toDtoGetList(doctorRepository.findAll());
    }

    @Override
    public DoctorDtoGet getDoctorById(UUID id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(()-> new UserNotFoundException(id, SearchType.ID));
        return doctorMapper.toDtoGet(doctor);
    }

    @Override
    public DoctorDtoGet getDoctorByEmail(String email) {
        Doctor doctor = findDoctorByEmail(email);
        return doctorMapper.toDtoGet(doctor);
    }

    @Override
    public DoctorDtoGet createDoctor(DoctorDtoCreate doctor) {

        checkEmailUniqueness(doctor.email());
        Long id = doctor.departmentId();

        Department department = departmentRepository.findById(doctor.departmentId())
                .orElseThrow(() ->  new DepartmentNotFoundException(DEPARTMENT_NOT_FOUND));

        Doctor newDoctor = doctorMapper.toEntity(doctor, department);

        Doctor savedDoctor = doctorRepository.save(newDoctor);

        String subject = "Welcome to Our App!";
        String body = "Hi " + savedDoctor.getFullName() + ",\n\nThanks for registering.";
        emailService.sendWelcomeEmail(savedDoctor.getEmail(), savedDoctor.getFullName(), "doctor");

        return doctorMapper.toDtoGet(savedDoctor);
    }


    @Override
    public void deleteDoctor(UUID id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(()-> new UserNotFoundException(id, SearchType.ID));
        doctorRepository.delete(doctor);
    }

    @Override
    public DoctorDtoGet updateDoctor(UUID id, DoctorDtoUpdate dto) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(()-> new UserNotFoundException(id, SearchType.ID));

        Doctor updatedDoctor = doctorMapper.toEntity(doctor, dto);
        Doctor savedDoctor = doctorRepository.save(updatedDoctor);
        return doctorMapper.toDtoGet(savedDoctor);
    }

    //NOTE: APPOINTMENT RELATED FUNCTIONS
    @Override
    public List<AvailableDoctorGet> getAvailableDoctors(Long departmentId, LocalDate date) {
        DayOfWeek day = date.getDayOfWeek();
        Department dept = departmentRepository.findById(departmentId)
                .orElseThrow(()-> new DepartmentNotFoundException(DEPARTMENT_NOT_FOUND));
        List<Doctor> doctors = doctorRepository.findByDepartmentAndWorkingHoursDay(dept, day);
        return doctors.stream().map(
                        doctor -> new AvailableDoctorGet(doctor.getFullName(), doctor.getId()))
                .toList();
    }

    @Override
    public List<TimeInterval> getAvailableSlots(UUID doctorId, LocalDate date) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new UserNotFoundException(doctorId, SearchType.ID));

        DayOfWeek day = date.getDayOfWeek();

        Optional<WorkingHours> workingHoursForDay = doctor.getWorkingHours().stream()
                .filter(wh -> wh.getDayOfWeek().equals(day))
                .findFirst();

        if (workingHoursForDay.isEmpty()) {
            return List.of();
        }

        List<TimeInterval> workingIntervals = workingHoursForDay.get().getTimeIntervals();

        // Generate 20-minute slots for the working intervals
        List<TimeInterval> allSlots = new ArrayList<>();
        for (TimeInterval interval : workingIntervals) {
            LocalTime slotStart = interval.getStartTime();
            LocalTime intervalEnd = interval.getEndTime();

            while (!slotStart.plusMinutes(20).isAfter(intervalEnd)) {
                TimeInterval slot = new TimeInterval();
                slot.setStartTime(slotStart);
                slot.setEndTime(slotStart.plusMinutes(20));
                allSlots.add(slot);

                slotStart = slotStart.plusMinutes(20);
            }
        }

        // Get booked appointment times for that doctor on the selected date
        List<Appointment> bookedAppointments = appointmentRepository
                .findByDoctorIdAndAppointmentDate(doctorId, date);

        Set<LocalTime> bookedTimes = bookedAppointments.stream()
                .map(appt -> appt.getAppointmentDateTime().toLocalTime())
                .collect(Collectors.toSet());

        // Return slots that aren't already booked
        return allSlots.stream()
                .filter(slot -> !bookedTimes.contains(slot.getStartTime()))
                .collect(Collectors.toList());
    }

    //NOTE: Methods for internal service-to-service use
    @Override
    public Doctor findDoctorByEmail(String email) {
        return doctorRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email, SearchType.EMAIL));
    }

    //NOTE: Doctors Client Visited
    @Override
    public List<VisitedDoctorGet> getDoctorsClientVisited(Long id) {
        List<Doctor> doctors = doctorRepository.findDistinctDoctorsByClientId(id);
        return doctorMapper.toVisitedDoctorGetList(doctors);
    }

    @Override
    public void changePassword(String email, ChangePasswordRequest newPassword) {
        Doctor doctor = findDoctorByEmail(email);
        if (!passwordEncoder.matches(newPassword.getCurrentPassword(), doctor.getHashedPassword())) {
            throw new IncorrectPasswordException(INCORRECT_PASSWORD);
        }
        doctor.setHashedPassword(passwordEncoder.encode(newPassword.getNewPassword()));
        doctorRepository.save(doctor);
    }

    //NOTE: Private methods
    private void checkEmailUniqueness(String email) {
        if (doctorRepository.existsByEmail(email)) {
            throw new UserAlreadyExistsException(email);
        }
    }
}
