import styles from './index.module.scss';

const ControlPannel = ({ selectedNode, setSelectedNode }) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className={styles.controlPanelWrapper}>
      {selectedNode ? (
        <div className={styles.settings}>
          <div className={styles.topHeader}>
            <button
              className={styles.back}
              onClick={() => setSelectedNode(null)}
            >
              ←
            </button>
            <div className={styles.msg}>Message</div>
          </div>
          <div className={styles.content}>
            <p>Text</p>

            <input
              type='text'
              value={selectedNode?.data?.label ?? ''}
              onChange={(e) => {
                setSelectedNode({
                  ...selectedNode,
                  data: { ...selectedNode?.data, label: e.target.value },
                });
              }}
              className={styles.textInput}
            />
          </div>
        </div>
      ) : (
        <>
          <div
            className={styles.message}
            onDragStart={(event) => onDragStart(event, 'textnode')}
            draggable
          >
            Message
          </div>
        </>
      )}
    </div>
  );
};

export default ControlPannel;
