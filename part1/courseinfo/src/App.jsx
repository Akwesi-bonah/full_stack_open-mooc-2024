const Header = (props) => {
  // console.log(props)
  return (
    <h1>{props.course}</h1>
  )
}

const Part = (props) => {
 // console.log(props)
  return (
    <div>
      {props.parts.map(element => (
        <p key={element.name}>
          {element.name} {element.exercises}
        </p>
      ))}
    </div>
  )
}

const Content = (props) => {
  console.log(props)
  return (
    <div>
      <Part parts={props.parts} />
    </div>
  )
}

const Total = (props) => {
  return (
    <p>Number of exercises {props.parts.reduce((total, part) => total + part.exercises, 0)}</p>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}

export default App;
