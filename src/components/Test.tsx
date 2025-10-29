const Test = () => {
  const randomNumber = Math.floor(Math.random() * 10) + 1;
  if (randomNumber % 2 === 0) {
    throw new Error('This is an intentional error from Test component!');
  }
  return <div>Test Component</div>;
};

export default Test;
