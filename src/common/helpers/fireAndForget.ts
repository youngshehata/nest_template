const fireAndForget = (fn: () => Promise<void>) => {
  fn().catch((err) => {
    console.error('[fireAndForget] Error:', err);
  });
};

export default fireAndForget;
