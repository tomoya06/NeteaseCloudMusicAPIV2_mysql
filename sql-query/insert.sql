-- insert a new song
-- can only be used with insert album. cannot use alone.
-- params: id / name / duration / albumId / mp3url / artists[]

insert into `song` (
	`id`, `name`, `duration`,	`albumId`, `mp3url`
) values (	
	[], [], [], [], []
)
	
	-- loops
insert into `song_artists` (
	`songId`, `artistId`
) values (
	[], []
)

-- insert a album
-- required artist exists. 
-- after this, insert its songs. 
-- params: id / name / coverUrl / type / subtype / description / publishTIme

insert into `album` (
	`id`, `name`, `coverUrl`, `type`, `subtype`, `description`, `publishTime`
) values (
	[], [], [], [], [], [], []
)

	-- loops
insert into `album_songs` (
	`albumId`, `songId`
) values (
	[], []
)

	-- loops
insert into `artist_albums` (
	`artistId`, `albumId`
) values (
	[], []
)

-- insert a artist
-- params: id / name / briefDesc / avatarUrl / trans
insert into `artist` (
	`id`, `name`, `briefDesc`, `avatarUrl`, `trans`
) values (
	[], [], [], [], []
)

-- insert a playlist
-- params: id / name / coverUrl / description
insert into `playlist` (
	`id`, `name`, `coverUrl`, `description`
) values (
	[], [], [], []
)

	-- loops
insert into `playlist_songs` (
	`playlistId`, `songId`
) values (
	[], []
)