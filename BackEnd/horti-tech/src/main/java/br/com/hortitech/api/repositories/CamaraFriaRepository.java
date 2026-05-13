package br.com.hortitech.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import br.com.hortitech.api.entities.CamaraFria;

@Repository
public interface CamaraFriaRepository extends JpaRepository<CamaraFria, Long> { 

}



