
CREATE TABLE `artist` (
    `artistId` varchar(10),
    `artistName` varchar(40) not null,
    `artistDesc` varchar(10),
    `avatarUrl` varchar(10),
    `coverUrl` varchar(10),
    `nameTrans` varchar(10),
    PRIMARY KEY (`artistId`)
)ENGINE=INNODB DEFAULT charset=utf8;

create table `album` (
  `albumId` varchar(10),
  `albumName` varchar(40) not null,
  `coverUrl` varchar(10),
  `albumType` varchar(10),
  `albumSubtype` varchar(10),
  `albumDesc` varchar(10),
  `publishTime` varchar(20),
  primary key(`albumId`)
)ENGINE=INNODB DEFAULT charset=utf8;

create table `song` (
  `songId` varchar(10),
  `songName` varchar(40) not null,
  `songDuration` varchar(10),
  `albumId` varchar(10),
  `mp3url` varchar(40),
  primary key(`songId`),
  foreign key(`albumId`) references `album`(`albumId`)
)ENGINE=INNODB DEFAULT charset=utf8;

create table `playlist` (
  `playlistId` varchar(10),
  `playlistName` varchar(40) not null,
  `coverUrl` varchar(10),
  `playlistDesc` varchar(10),
  `isOfficial` tinyint(1),
  primary key(`playlistId`)
)ENGINE=INNODB DEFAULT charset=utf8;

create table `album_songs` (
  `albumId` varchar(10) not null,
  `songId` varchar(10) not null,
  foreign key(`albumId`) references `album`(`albumId`) on delete cascade on update RESTRICT,
  foreign key(`songId`) references `song`(`songId`) on delete cascade  on update RESTRICT
)ENGINE=INNODB DEFAULT charset=utf8;

create table `artist_albums` (
  `artistId` varchar(10) not null,
  `albumId` varchar(10) not null,
  foreign key(`artistId`) references `artist`(`artistId`) on delete cascade  on update RESTRICT,
  foreign key(`albumId`) references `album`(`albumId`) on delete cascade  on update RESTRICT
)ENGINE=INNODB DEFAULT charset=utf8;

create table `song_artists` (
  `songId` varchar(10) not null,
  `artistId` varchar(10) not null,
  foreign key(`songId`) references `song`(`songId`) on delete cascade  on update RESTRICT,
  foreign key(`artistId`) references `artist`(`artistId`) on delete cascade  on update RESTRICT
)ENGINE=INNODB DEFAULT charset=utf8;

create table `playlist_songs` (
  `playlistId` varchar(10) not null,
  `songId` varchar(10) not null,
  foreign key(`songId`) references `song`(`songId`) on delete cascade  on update RESTRICT,
  foreign key(`playlistId`) references `playlist`(`playlistId`) on delete cascade  on update RESTRICT
)ENGINE=INNODB DEFAULT charset=utf8;





create trigger `prevent_update_song_id` 
before update on `song`
for each row 
begin
  if (old.id is not null) then 
    signal SQLSTATE '45000' SET MESSAGE_TEXT = 'id cannot be altered';
  end if;
end;

create trigger `prevent_update_album_id` 
before update on `album`
for each row 
begin
  if (old.id is not null) then 
    signal sqlstate value '45000' set message_text = `id cannot be altered`;
  end if;
end;


create trigger `prevent_update_playlist_id` 
before update on `playlist`
for each row 
begin
  if (old.id is not null) then 
    signal sqlstate value '45000' set message_text = `id cannot be altered`;
  end if;
end;


create trigger `prevent_update_artist_id` 
before update on `artist`
for each row 
begin
  if (old.id is not null) then 
    signal sqlstate value '45000' set message_text = `id cannot be altered`;
  end if;
end;
