import { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';
import '../styles/auth.scss';

import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';


export function Home() {
  const { user, signInWithGoogle } = useAuth();
  const history = useHistory();
  const [roomCode, setRoomCode] = useState('');

  async function handleCreateRoom() {
    try {
      if (!user) {
        await signInWithGoogle();
      }

      history.push('/rooms/new');
    } catch (err) {
      console.log(err);
    }
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault()

    if (roomCode.trim() === '') {
      return
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get()

    if (!roomRef.exists()) {
      toast.error("Sala não encontrada!", {
        icon: "❌",
        duration: 5000,
        position: "bottom-right",
        style: {
          fontSize: '18px',
          background: '#fefefe',
          border: '3px solid #835afd',
          borderRadius: '10px',
        }
      })
      return
    }

    if (roomRef.val().endedAt) {
      toast.error("Sala encerrada!", {
        icon: "❌",
        duration: 5000,
        position: "bottom-right",
        style: {
          fontSize: '18px',
          background: '#fefefe',
          border: '3px solid #835afd',
          borderRadius: '10px',
        }
      })
      return
    }

    history.push(`/rooms/${roomCode}`)
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="illustration" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>

      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <button
            className="create-room"
            onClick={handleCreateRoom}
          >
            <img src={googleIconImg} alt="Logo do Google" />
            Cire sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom} >
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit" >
              Entrar na sala
            </Button>
          </form>
          <Toaster />
        </div>
      </main>
    </div>
  )
}