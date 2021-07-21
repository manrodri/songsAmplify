import React, {useEffect, useState} from 'react'
import {AmplifySignOut} from "@aws-amplify/ui-react";
import {IconButton, Paper} from "@material-ui/core";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ReactPlayer from "react-player";
import AddIcon from "@material-ui/icons/Add";
import {API, graphqlOperation, Storage} from "aws-amplify";
import {listSongs} from "../../graphql/queries";
import {updateSong} from "../../graphql/mutations";
import AddSong from "../AddSong";

const SongList = () => {

    const [songs, setSongs] = useState([]);
    const [songPlaying, setSongPlaying] = useState('')
    const [audioURL, setAudioURL] = useState('')
    const [showAddSong, setShowAddNewSong] = useState(false)

    useEffect(() => {
        fetchSongs();
    }, []);

    const fetchSongs = async () => {
        try {
            const songData = await API.graphql(graphqlOperation(listSongs));
            const songList = songData.data.listSongs.items;
            setSongs(songList);
        } catch (error) {
            console.log('error on fetching songs', error);
        }
    };

    const addLike = async idx => {
        try {
            const song = songs[idx];
            song.like = song.like + 1;
            delete song.createdAt;
            delete song.updatedAt;

            const songData = await API.graphql(graphqlOperation(updateSong, {input: song}));
            const songList = [...songs];
            songList[idx] = songData.data.updateSong;
            setSongs(songList);
        } catch (error) {
            console.error('error on adding Like to song', error);
        }
    };

    const tooglePlaying = async idx => {
        try {
            if (songPlaying === idx) {
                setSongPlaying('');
                return
            }

            const songFilePath = songs[idx].filePath
            try {
                const fileAccessURL = await Storage.get(songFilePath, {expires: 60})
                setSongPlaying(idx)
                setAudioURL(fileAccessURL)

            } catch (err) {
                console.error('Error playing song: ', songs[idx].title)
            }

            setSongPlaying(idx)
            console.log()
        } catch (err) {
            console.error('error toogling song: ', err.message)
            setAudioURL('')
            setSongPlaying('')
        }
    }

    return (
        <div className="App">

            <div className="songList">
                {songs.map((song, idx) => {
                    return (
                        <Paper variant="outlined" elevation={2} key={`song${idx}`}>
                            <div className="songCard">
                                <IconButton aria-label="play" onClick={() => tooglePlaying(idx)}>
                                    {songPlaying === idx ? <PauseIcon/> : <PlayArrowIcon/>}
                                </IconButton>
                                <div>
                                    <div className="songTitle">{song.title}</div>
                                    <div className="songOwner">{song.owner}</div>
                                </div>
                                <div>
                                    <IconButton aria-label="like" onClick={() => addLike(idx)}>
                                        <FavoriteIcon/>
                                    </IconButton>
                                    {song.like}
                                </div>
                                <div className="songDescription">{song.description}</div>

                            </div>
                            {songPlaying === idx ? (
                                <div className={'audioPlayer'}>
                                    <ReactPlayer
                                        url={audioURL}
                                        controls
                                        playing
                                        height={'50px'}
                                        onPause={() => tooglePlaying(idx)}
                                    />
                                </div>
                            ) : null}
                        </Paper>
                    );
                })}

            </div>
            {
                    showAddSong ? (
                        <AddSong onUpload={() => {
                            setShowAddNewSong(false)
                            fetchSongs()
                        }}/>
                    ) : <IconButton onClick={() => setShowAddNewSong(true)}>
                        <AddIcon/>
                    </IconButton>
                }
        </div>
    );
}

export default SongList;