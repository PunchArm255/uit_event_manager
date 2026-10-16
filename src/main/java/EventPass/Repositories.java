package EventPass;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

interface EventRepository extends JpaRepository<Event, Long> {
}

interface RegistrationRepository extends JpaRepository<Registration, Long> {
    // Spring reads this method name and automatically writes:
    // SELECT * FROM registration WHERE event_id = ?
    List<Registration> findByEventId(Long eventId);
}