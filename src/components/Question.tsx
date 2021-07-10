import { ReactNode } from 'react';
import cx from 'classnames';
import '../styles/question.scss';

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  isAnswered?: boolean;
  isHighlight?: boolean;
  children?: ReactNode;
}

export function Question({
  content,
  author,
  isAnswered = false,
  isHighlight = false,
  children
}: QuestionProps) {
  return (
    <div className={cx(
      'question',
      { answer: isAnswered },
      { highlight: isHighlight && !isAnswered }
    )} >
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>
          {children}
        </div>
      </footer>
    </div>
  )
}