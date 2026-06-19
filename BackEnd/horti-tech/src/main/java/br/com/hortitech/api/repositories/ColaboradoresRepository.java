package br.com.hortitech.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import br.com.hortitech.api.entities.Colaboradores;

@Repository
public interface ColaboradoresRepository extends JpaRepository<Colaboradores, Long> { 

}