package br.com.hortitech.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import br.com.hortitech.api.entities.Alerta;

@Repository
public interface AlertaRepository extends JpaRepository<Alerta, Long> { 

}
