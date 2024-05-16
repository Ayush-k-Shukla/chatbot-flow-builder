import styles from './index.module.scss';

const ControlPannel = ({ name, setName, nodeSelected, setSelectedNodes }) => {
  return (
    <div className={styles.controlPanelWrapper}>
      {nodeSelected ? (
        <div className={styles.settings}>
          <div className={styles.topHeader}>
            <button className={styles.back}>←</button>
            <div className={styles.msg}>Message</div>
          </div>
          <div className={styles.contemt}></div>
        </div>
      ) : (
        <div className={styles.message}></div>
      )}
    </div>
  );
};

export default ControlPannel;
