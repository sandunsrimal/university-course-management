package com.erp.course.backend.service;

import com.erp.course.backend.dto.ResultRequest;
import com.erp.course.backend.dto.ResultResponse;
import com.erp.course.backend.entity.Result;
import com.erp.course.backend.entity.Result.ResultType;
import com.erp.course.backend.entity.Course;
import com.erp.course.backend.entity.Instructor;
import com.erp.course.backend.entity.Student;
import com.erp.course.backend.repository.ResultRepository;
import com.erp.course.backend.repository.CourseRepository;
import com.erp.course.backend.repository.InstructorRepository;
import com.erp.course.backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ResultService {
    
    @Autowired
    private ResultRepository resultRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private InstructorRepository instructorRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    // Create a new result
    public ResultResponse createResult(ResultRequest request) {
        // Validate that the course exists
        Course course = courseRepository.findById(request.getCourseId())
            .orElseThrow(() -> new RuntimeException("Course not found"));
        
        // Validate that the instructor exists
        Instructor instructor = instructorRepository.findById(request.getInstructorId())
            .orElseThrow(() -> new RuntimeException("Instructor not found"));
        
        // Validate that the student exists
        Student student = studentRepository.findById(request.getStudentId())
            .orElseThrow(() -> new RuntimeException("Student not found"));
        
        // Validate that the student is enrolled in the course
        if (!course.getEnrolledStudents().contains(student)) {
            throw new RuntimeException("Student is not enrolled in this course");
        }
        
        // Validate that the instructor is assigned to the course
        if (!course.getInstructor().getId().equals(instructor.getId())) {
            throw new RuntimeException("Instructor is not assigned to this course");
        }
        
        // Check if a result already exists for this assessment
        if (resultRepository.existsByCourseIdAndStudentIdAndResultTypeAndTitleAndIsActiveTrue(
                request.getCourseId(), request.getStudentId(), 
                ResultType.valueOf(request.getResultType()), request.getTitle())) {
            throw new RuntimeException("A result already exists for this assessment");
        }
        
        // Create the result
        Result result = new Result();
        result.setResultValue(request.getResultValue());
        result.setResultType(ResultType.valueOf(request.getResultType()));
        result.setTitle(request.getTitle());
        result.setDescription(request.getDescription());
        result.setStudent(student);
        result.setCourse(course);
        result.setInstructor(instructor);
        result.setIsReleased(request.getIsReleased());
        result.setIsActive(true);
        
        Result savedResult = resultRepository.save(result);
        return new ResultResponse(savedResult);
    }
    
    // Get a result by ID
    public ResultResponse getResultById(Long id) {
        Result result = resultRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Result not found"));
        return new ResultResponse(result);
    }
    
    // Update a result
    public ResultResponse updateResult(Long id, ResultRequest request) {
        Result result = resultRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Result not found"));
        
        // Validate that the course exists
        Course course = courseRepository.findById(request.getCourseId())
            .orElseThrow(() -> new RuntimeException("Course not found"));
        
        // Validate that the instructor exists
        Instructor instructor = instructorRepository.findById(request.getInstructorId())
            .orElseThrow(() -> new RuntimeException("Instructor not found"));
        
        // Validate that the student exists
        Student student = studentRepository.findById(request.getStudentId())
            .orElseThrow(() -> new RuntimeException("Student not found"));
        
        // Update the result
        result.setResultValue(request.getResultValue());
        result.setResultType(ResultType.valueOf(request.getResultType()));
        result.setTitle(request.getTitle());
        result.setDescription(request.getDescription());
        result.setStudent(student);
        result.setCourse(course);
        result.setInstructor(instructor);
        result.setIsReleased(request.getIsReleased());
        
        Result updatedResult = resultRepository.save(result);
        return new ResultResponse(updatedResult);
    }
    
    // Delete a result (soft delete)
    public void deleteResult(Long id) {
        Result result = resultRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Result not found"));
        result.setIsActive(false);
        resultRepository.save(result);
    }
    
    // Release a result
    public ResultResponse releaseResult(Long id) {
        Result result = resultRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Result not found"));
        result.release();
        Result releasedResult = resultRepository.save(result);
        return new ResultResponse(releasedResult);
    }
    
    // Unrelease a result
    public ResultResponse unreleaseResult(Long id) {
        Result result = resultRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Result not found"));
        result.unrelease();
        Result unreleasedResult = resultRepository.save(result);
        return new ResultResponse(unreleasedResult);
    }
    
    // Get all results for a course
    public List<ResultResponse> getResultsByCourse(Long courseId) {
        List<Result> results = resultRepository.findByCourseIdAndIsActiveTrue(courseId);
        return results.stream()
            .map(ResultResponse::new)
            .collect(Collectors.toList());
    }
    
    // Get all results for a student
    public List<ResultResponse> getResultsByStudent(Long studentId) {
        List<Result> results = resultRepository.findByStudentIdAndIsActiveTrue(studentId);
        return results.stream()
            .map(ResultResponse::new)
            .collect(Collectors.toList());
    }
    
    // Get all results for an instructor
    public List<ResultResponse> getResultsByInstructor(Long instructorId) {
        List<Result> results = resultRepository.findByInstructorIdAndIsActiveTrue(instructorId);
        return results.stream()
            .map(ResultResponse::new)
            .collect(Collectors.toList());
    }
    
    // Get released results for a student
    public List<ResultResponse> getReleasedResultsByStudent(Long studentId) {
        List<Result> results = resultRepository.findByStudentIdAndIsReleasedTrueAndIsActiveTrue(studentId);
        return results.stream()
            .map(ResultResponse::new)
            .collect(Collectors.toList());
    }
    
    // Get results for a specific course and student
    public List<ResultResponse> getResultsByCourseAndStudent(Long courseId, Long studentId) {
        List<Result> results = resultRepository.findByCourseIdAndStudentIdAndIsActiveTrue(courseId, studentId);
        return results.stream()
            .map(ResultResponse::new)
            .collect(Collectors.toList());
    }
    
    // Get released results for a specific course and student
    public List<ResultResponse> getReleasedResultsByCourseAndStudent(Long courseId, Long studentId) {
        List<Result> results = resultRepository.findByCourseIdAndStudentIdAndIsReleasedTrueAndIsActiveTrue(courseId, studentId);
        return results.stream()
            .map(ResultResponse::new)
            .collect(Collectors.toList());
    }
    
    // Get results by course and instructor
    public List<ResultResponse> getResultsByCourseAndInstructor(Long courseId, Long instructorId) {
        List<Result> results = resultRepository.findByCourseIdAndInstructorIdAndIsActiveTrue(courseId, instructorId);
        return results.stream()
            .map(ResultResponse::new)
            .collect(Collectors.toList());
    }
    
    // Get average result for a student in a course
    public Double getAverageResultForStudentInCourse(Long courseId, Long studentId) {
        return resultRepository.getAverageResultForStudentInCourse(courseId, studentId);
    }
    
    // Get average result for a student across all courses
    public Double getAverageResultForStudent(Long studentId) {
        return resultRepository.getAverageResultForStudent(studentId);
    }
    
    // Get average result for a course
    public Double getAverageResultForCourse(Long courseId) {
        return resultRepository.getAverageResultForCourse(courseId);
    }
    
    // Get result distribution for a course
    public List<Object[]> getResultDistributionForCourse(Long courseId) {
        return resultRepository.getResultDistributionForCourse(courseId);
    }
    
    // Get result statistics for a course
    public ResultStatistics getResultStatisticsForCourse(Long courseId) {
        List<Result> results = resultRepository.findByCourseIdAndIsReleasedTrueAndIsActiveTrue(courseId);
        
        if (results.isEmpty()) {
            return new ResultStatistics(0L, 0.0, 0.0, 0.0, 0.0, 0.0);
        }
        
        long totalResults = results.size();
        double average = results.stream()
            .mapToDouble(r -> r.getResultValue().doubleValue())
            .average()
            .orElse(0.0);
        
        double highest = results.stream()
            .mapToDouble(r -> r.getResultValue().doubleValue())
            .max()
            .orElse(0.0);
        
        double lowest = results.stream()
            .mapToDouble(r -> r.getResultValue().doubleValue())
            .min()
            .orElse(0.0);
        
        // Calculate standard deviation
        double variance = results.stream()
            .mapToDouble(r -> Math.pow(r.getResultValue().doubleValue() - average, 2))
            .average()
            .orElse(0.0);
        double standardDeviation = Math.sqrt(variance);
        
        return new ResultStatistics(totalResults, average, highest, lowest, standardDeviation, variance);
    }
    
    // Get result statistics for a student
    public ResultStatistics getResultStatisticsForStudent(Long studentId) {
        List<Result> results = resultRepository.findByStudentIdAndIsReleasedTrueAndIsActiveTrue(studentId);
        
        if (results.isEmpty()) {
            return new ResultStatistics(0L, 0.0, 0.0, 0.0, 0.0, 0.0);
        }
        
        long totalResults = results.size();
        double average = results.stream()
            .mapToDouble(r -> r.getResultValue().doubleValue())
            .average()
            .orElse(0.0);
        
        double highest = results.stream()
            .mapToDouble(r -> r.getResultValue().doubleValue())
            .max()
            .orElse(0.0);
        
        double lowest = results.stream()
            .mapToDouble(r -> r.getResultValue().doubleValue())
            .min()
            .orElse(0.0);
        
        // Calculate standard deviation
        double variance = results.stream()
            .mapToDouble(r -> Math.pow(r.getResultValue().doubleValue() - average, 2))
            .average()
            .orElse(0.0);
        double standardDeviation = Math.sqrt(variance);
        
        return new ResultStatistics(totalResults, average, highest, lowest, standardDeviation, variance);
    }
    
    // Bulk release results for a course
    public void bulkReleaseResultsForCourse(Long courseId) {
        List<Result> unreleasedResults = resultRepository.findByCourseIdAndIsReleasedFalseAndIsActiveTrue(courseId);
        for (Result result : unreleasedResults) {
            result.release();
        }
        resultRepository.saveAll(unreleasedResults);
    }
    
    // Bulk unrelease results for a course
    public void bulkUnreleaseResultsForCourse(Long courseId) {
        List<Result> releasedResults = resultRepository.findByCourseIdAndIsReleasedTrueAndIsActiveTrue(courseId);
        for (Result result : releasedResults) {
            result.unrelease();
        }
        resultRepository.saveAll(releasedResults);
    }
    
    // Inner class for result statistics
    public static class ResultStatistics {
        private Long totalResults;
        private Double averageResult;
        private Double highestResult;
        private Double lowestResult;
        private Double standardDeviation;
        private Double variance;
        
        public ResultStatistics(Long totalResults, Double averageResult, Double highestResult, 
                              Double lowestResult, Double standardDeviation, Double variance) {
            this.totalResults = totalResults;
            this.averageResult = averageResult;
            this.highestResult = highestResult;
            this.lowestResult = lowestResult;
            this.standardDeviation = standardDeviation;
            this.variance = variance;
        }
        
        // Getters
        public Long getTotalResults() { return totalResults; }
        public Double getAverageResult() { return averageResult; }
        public Double getHighestResult() { return highestResult; }
        public Double getLowestResult() { return lowestResult; }
        public Double getStandardDeviation() { return standardDeviation; }
        public Double getVariance() { return variance; }
    }
} 