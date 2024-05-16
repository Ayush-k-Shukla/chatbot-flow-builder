import { Handle, Position } from 'reactflow';
import styles from './index.module.scss';

const Node = ({ selected, data }) => {
  return (
    <div className={selected ? styles.selectedNodeWrapper : styles.nodeWrapper}>
      <div className={styles.sendMessageHeader}>
        <p className={styles.headtext}>✉️ Send Message</p>
      </div>
      <div className={styles.text}>
        <div className=''>{data?.label ?? 'Text Node'}</div>
      </div>

      <div>
        <Handle id='a' type='target' position={Position.Left} />
        <Handle id='b' type='source' position={Position.Right} />
      </div>
    </div>
  );
};

export default Node;
