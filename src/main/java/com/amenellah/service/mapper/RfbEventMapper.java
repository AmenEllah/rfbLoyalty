package com.amenellah.service.mapper;

import com.amenellah.domain.*;
import com.amenellah.service.dto.RfbEventDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity RfbEvent and its DTO RfbEventDTO.
 */
@Mapper(componentModel = "spring", uses = {RfbLocationMapper.class})
public interface RfbEventMapper extends EntityMapper<RfbEventDTO, RfbEvent> {

    @Mapping(source = "rfbLocation.id", target = "rfbLocationId")
    RfbEventDTO toDto(RfbEvent rfbEvent);

    @Mapping(source = "rfbLocationId", target = "rfbLocation")
    @Mapping(target = "rfbEventAttendances", ignore = true)
    RfbEvent toEntity(RfbEventDTO rfbEventDTO);

    default RfbEvent fromId(Long id) {
        if (id == null) {
            return null;
        }
        RfbEvent rfbEvent = new RfbEvent();
        rfbEvent.setId(id);
        return rfbEvent;
    }
}
