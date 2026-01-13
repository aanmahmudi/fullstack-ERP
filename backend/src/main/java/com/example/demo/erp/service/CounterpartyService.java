package com.example.demo.erp.service;

import com.example.demo.erp.dto.Dtos.CounterpartyDTO;
import com.example.demo.erp.entity.Counterparty;
import com.example.demo.erp.repository.CounterpartyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CounterpartyService {
    private final CounterpartyRepository repository;

    public CounterpartyService(CounterpartyRepository repository) {
        this.repository = repository;
    }

    public CounterpartyDTO create(CounterpartyDTO dto) {
        Counterparty entity = new Counterparty();
        entity.setType(Counterparty.Type.valueOf(dto.type));
        entity.setName(dto.name);
        entity.setEmail(dto.email);
        entity.setPhone(dto.phone);
        repository.save(entity);
        return toDto(entity);
    }

    public List<CounterpartyDTO> list() {
        return repository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public CounterpartyDTO get(Long id) {
        return repository.findById(id).map(this::toDto).orElseThrow(() -> new RuntimeException("Counterparty not found"));
    }

    public CounterpartyDTO update(Long id, CounterpartyDTO dto) {
        Counterparty entity = repository.findById(id).orElseThrow(() -> new RuntimeException("Counterparty not found"));
        if (dto.type != null) entity.setType(Counterparty.Type.valueOf(dto.type));
        if (dto.name != null) entity.setName(dto.name);
        entity.setEmail(dto.email);
        entity.setPhone(dto.phone);
        repository.save(entity);
        return toDto(entity);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    private CounterpartyDTO toDto(Counterparty entity) {
        CounterpartyDTO dto = new CounterpartyDTO();
        dto.id = entity.getId();
        dto.type = entity.getType().name();
        dto.name = entity.getName();
        dto.email = entity.getEmail();
        dto.phone = entity.getPhone();
        return dto;
    }
}

