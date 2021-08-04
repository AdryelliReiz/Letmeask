import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { database } from '../services/firebase';
import { useRoom } from '../hooks/useRoom';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import likeImg from '../assets/images/like.svg';
import '../styles/room.scss';


type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [questionIdConfirm, setQuestionIdConfirm] = useState('');

  const params = useParams<RoomParams>();
  const roomId = params.id;
  const history = useHistory();

  const { questions, title } = useRoom(roomId); 
  
  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history.push('/')
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    })
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    })
  }

  async function handleDeleteQuestion(questionId: string) {
    setIsOpenModal(true);
    setQuestionIdConfirm(questionId);
  }

  async function handleConfirmDeleteQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();

    setIsOpenModal(false)
  }
  return (
    <div id="page-room" >
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button
              isOutlined
              onClick={handleEndRoom}
            >Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>} 
        </div>

        <div className="question-list">
          {questions.map(question => (
            <Question
              key={question.id}
              content={question.content}
              author={question.author}
              isAnswered={question.isAnswered}
              isHighlight={question.isHighlighted}
            >
              {!question.isAnswered && (
                <>
                  <span>
                    <p>{question.likeCount}</p>
                    <img src={likeImg} alt="Likes" />
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCheckQuestionAsAnswered(question.id)}
                  >
                    <img src={checkImg} alt="Marcar pergunta como respondida" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleHighlightQuestion(question.id)}
                  >
                    <img src={answerImg} alt="Destacar pertgunta" />
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => handleDeleteQuestion(question.id)}
              >
                <img src={deleteImg} alt="Remover pergunta" />
              </button>
            </Question>
          ))}
        </div>
      </main>
      
      {isOpenModal && (
        <div className="screen-modal" >
          <div className="modal" >
            <h3>Tem certeza que você deseja remover essa pergunta?</h3>

            <div className="buttons" >
              <button
                className="no-button"
                onClick={() => setIsOpenModal(false)}
              >
                No
              </button>
              <button
                className="yes-button"
                onClick={() => handleConfirmDeleteQuestion(questionIdConfirm)}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}