import style from "./index.module.css";

interface SetCardProps {
  title: string;
  description: string;
}

const SetCard: React.FC<SetCardProps> = ({ title, description }) => {
  return (
    <div className={style.cards}>
      <div className={style.card}></div>
      <div className={style.card}></div>
      <div className={style.card}></div>
      <div className={style.container}>
        <div className={style.container_text}>
          <div className={style.header} title={title}>
            <h3>{title}</h3>
          </div>
          <div className={style.description} title={description}>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetCard;
