import { useState } from 'react'

const Header = ({text}) => <div><h1>{text}</h1></div>
const Button = ({onSmash, text}) =>
{
  return(
    <button
    onClick={onSmash}>
      {text}
    </button>
  )
}

const StatisticsLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
);
const Statistics = ({ good, neutral, bad , all}) => {
  const total = all
  const average = total === 0 ? 0 : (good - bad) / total;
  const positive = total === 0 ? 0 : (good / total) * 100;

  return (
    <div>
      {total === 0 ? (
       <p>No feedback given</p>
      ) : (
        <>
          <table>
            <tbody>
         <StatisticsLine text="good" value={good} />
          <StatisticsLine text="neutral" value={neutral} />
          <StatisticsLine text="bad" value={bad} />
          <StatisticsLine text="all" value={total} />
          <StatisticsLine text="average" value={average} />
          <StatisticsLine text="positive" value={positive + " %"} />
          </tbody>
           </table>
        </>
      )}
    </div>
  );
};

const App = () => {
  // save clicks of each button to its own state
  // const [good, setGood] = useState(0)
  // const [neutral, setNeutral] = useState(0)
  // const [bad, setBad] = useState(0)

  const [clicks, setClicks] = useState({
    good: 0,
    neutral: 0,
    bad: 0,
    all: 0
  })

  const handleGoodClick = () => setClicks({...clicks, good: clicks.good + 1, all: clicks.all + 1})
  const handleNeutralClick = () => (setClicks({...clicks, neutral: clicks.neutral + 1, all: clicks.all + 1}))
  const handleBadClick = () => (setClicks({...clicks, bad: clicks.bad + 1, all: clicks.all + 1}))

  // const total = clicks.all
  // const average = (clicks.good - clicks.bad) / total
  // const positive = (clicks.good / total) * 100


  return (
    <div>
      <Header text={"give feedback"} ></Header>
      <Button text="good" onSmash={handleGoodClick} ></Button>
      <Button text="neutral" onSmash={handleNeutralClick}></Button>
      <Button text="bad" onSmash={handleBadClick}></Button>
      <Header text={"Statistics"}></Header>

      {/* <p>good {clicks.good}</p>
      <p>neutral {clicks.neutral}</p>
      <p>bad {clicks.bad}</p>
      <p>all {total}</p>
      <p>average {average}</p>
      <p>positive {positive} %</p> */}

      <Statistics good={clicks.good} neutral={clicks.neutral} bad={clicks.bad} all={clicks.all}></Statistics>
    </div>
  )
}

export default App