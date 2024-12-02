import classNames from 'classnames';

interface IProps {
  rotate?: boolean;
}

const CaretIcon: React.FC<IProps> = ({ rotate }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={classNames('w-4 h-4 ml-5')}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
  );
};

export default CaretIcon;
