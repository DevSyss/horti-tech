package br.com.hortitech.api.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import br.com.hortitech.api.entities.Usuario;
import br.com.hortitech.api.repositories.UsuarioRepository;

@Service
public class UsuarioServices {

	@Autowired
	private UsuarioRepository repository;

	public List<Usuario> listarTodos() {
		return repository.findAll();
	}

	public Optional<Usuario> buscarPorId(Long id) {
		return repository.findById(id);

	}

	public Usuario salvar(Usuario usuario) {
		return repository.save(usuario);
	}

	public Usuario atualizar(Long id, Usuario usuarioAlterado) {
		Optional<Usuario> existente = buscarPorId(id);

		if (existente.isPresent()) {

			Usuario atualizado = existente.get();

			atualizado.setEmail(usuarioAlterado.getEmail());
			atualizado.setTipo(usuarioAlterado.getTipo());
			atualizado.setSenha(usuarioAlterado.getSenha());
			return repository.save(atualizado);
		}

		return null;
	}

	public void deletar(Long id) {
		repository.deleteById(id);

	}

	@Autowired
	private BCryptPasswordEncoder password;

	public Usuario salvarUsuario(Usuario usuario) {

		Optional<Usuario> usuarioExistente = buscarPorEmail(usuario.getEmail());

		if (usuarioExistente.isPresent()) {
			throw new RuntimeException("Já Existe Um Usuário com este email");

		}

		String senhaCriptograda = password.encode(usuario.getSenha());

		usuario.setSenha(senhaCriptograda);

		return repository.save(usuario);
	}

	public Optional<Usuario> buscarPorEmail(String email) {

		return repository.findByEmail(email);
	}

	public Usuario login(String email, String senha) {

		Usuario usuario = repository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("Usuário Não Encontrado"));

		boolean senhaValida = password.matches(senha, usuario.getSenha());

		if (!senhaValida) {
			throw new RuntimeException("Senha Inválida");

		}

		return usuario;

	}
}
