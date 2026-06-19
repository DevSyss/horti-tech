package br.com.hortitech.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import br.com.hortitech.api.entities.RegistroTermico;

@Repository
public interface RegistroTermicoRepository extends JpaRepository<RegistroTermico, Long> { 

}



