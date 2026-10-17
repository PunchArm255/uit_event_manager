package EventPass;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

interface EventRepository extends JpaRepository<Event, Long> {
}

interface RegistrationRepository extends JpaRepository<Registration, Long> {
    List<Registration> findByEventId(Long eventId);

    List<Registration> findByEmailIgnoreCase(String email);

    Optional<Registration> findByBadgeCodeIgnoreCase(String badgeCode);

    Optional<Registration> findByEventIdAndEmailIgnoreCase(Long eventId, String email);
}

interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailIgnoreCase(String email);
}