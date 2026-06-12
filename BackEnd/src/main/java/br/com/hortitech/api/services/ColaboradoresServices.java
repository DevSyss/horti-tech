package br.com.hortitech.api.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.hortitech.api.entities.Colaboradores;
import br.com.hortitech.api.entities.Usuario;
import br.com.hortitech.api.repositories.ColaboradoresRepository;

@Service
public class ColaboradoresServices {

	@Autowired
	private ColaboradoresRepository repository;
	
	@Autowired
	private UsuarioServices usuarioService; 

	public List<Colaboradores> listarTodos() {
		return repository.findAll();
	}

	public Optional <Colaboradores> buscarPorId(Long id) {
		return repository.findById(id);
	}

	public Colaboradores salvar(Colaboradores colaboradores) {
		Usuario usuarioSalvo = usuarioService.salvar(colaboradores.getUsuario());

		colaboradores.setUsuario(usuarioSalvo);

		return repository.save(colaboradores);
	}

	public Colaboradores atualizar(Long id, Colaboradores colaboradoresAlterado) {
		Optional <Colaboradores> existente = buscarPorId(id);
		
		if (existente.isPresent()) {
			
			Colaboradores atualizado = existente.get();
			
			atualizado.setNome(colaboradoresAlterado.getNome());
			atualizado.setCpf(colaboradoresAlterado.getCpf());
			atualizado.setEmail(colaboradoresAlterado.getEmail());
			atualizado.setSenha(colaboradoresAlterado.getSenha());
			atualizado.setTipo(colaboradoresAlterado.getTipo());
			
			return repository.save(atualizado);
		}
		
		return null;
	}

	public void deletar(Long id) {
		repository.deleteById(id);
	}
}