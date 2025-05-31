package com.tfg.back.service.serviceImpl;

import com.tfg.back.enums.SearchType;
import com.tfg.back.exceptions.department.DepartmentNotFoundException;
import com.tfg.back.exceptions.user.UserAlreadyExistsException;
import com.tfg.back.exceptions.user.UserNotFoundException;
import com.tfg.back.mappers.DoctorMapper;
import com.tfg.back.model.*;
import com.tfg.back.model.dtos.doctor.*;
import com.tfg.back.repository.AppointmentRepository;
import com.tfg.back.repository.DepartmentRepository;
import com.tfg.back.repository.DoctorRepository;
import com.tfg.back.service.DepartmentService;
import com.tfg.back.service.DoctorService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.print.Doc;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final DoctorMapper doctorMapper;
    private final AppointmentRepository appointmentRepository;

    @Autowired
    public DoctorServiceImpl(DoctorRepository doctorRepository, DepartmentRepository departmentRepository, DoctorMapper doctorMapper, AppointmentRepository appointmentRepository) {
        this.doctorRepository = doctorRepository;
        this.departmentRepository = departmentRepository;
        this.doctorMapper = doctorMapper;
        this.appointmentRepository = appointmentRepository;
    }


    //NOTE: Public Crud methods
    @Override
    public List<DoctorDtoGet> getAllDoctors() {
        return doctorMapper.toDtoGetList(doctorRepository.findAll());
    }

    @Override
    public DoctorDtoGet getDoctorById(Long id) {
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
                .orElseThrow(() ->  new DepartmentNotFoundException("department with ID: "+id+" is not found"));

        Doctor newDoctor = doctorMapper.toEntity(doctor, department);

        Doctor savedDoctor = doctorRepository.save(newDoctor);
        return doctorMapper.toDtoGet(savedDoctor);
    }


    @Override
    public void deleteDoctor(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(()-> new UserNotFoundException(id, SearchType.ID));
        doctorRepository.delete(doctor);
    }

    @Override
    public DoctorDtoGet updateDoctor(Long id, DoctorDtoUpdate dto) {
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
                .orElseThrow(()-> new DepartmentNotFoundException("department with name: "+departmentId+" is not found"));
        List<Doctor> doctors = doctorRepository.findByDepartmentAndWorkingHoursDay(dept, day);
        return doctors.stream().map(
                        doctor -> new AvailableDoctorGet(doctor.getFullName(), doctor.getId()))
                .toList();
    }

    @Override
    public List<TimeInterval> getAvailableSlots(Long doctorId, LocalDate date) {
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

    //NOTE: Private methods
    private void checkEmailUniqueness(String email) {
        if (doctorRepository.existsByEmail(email)) {
            throw new UserAlreadyExistsException(email);
        }
    }
}
