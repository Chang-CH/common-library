import styles from './s.module.scss';

const BrutalistButton = ({
  children,
  className,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  rest?: {
    [key: string]: any;
  };
}) => {
  return (
    <button
      className={
        className ? `${styles.normalButton} ${className}` : styles.normalButton
      }
      {...rest}
    >
      {children}
    </button>
  );
};

export default BrutalistButton;
