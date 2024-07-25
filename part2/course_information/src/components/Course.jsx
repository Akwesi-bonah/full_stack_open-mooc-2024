const Header = (props) => {
    // console.log(props)
    return <h1>{props.course}</h1>;
  };
  
  const Part = (props) => {
    // console.log(props)
    return (
      <div>
        {props.parts.map((element) => (
          <p key={element.name}>
            {element.name} {element.exercises}
          </p>
        ))}
      </div>
    );
  };
  
  const Content = ({ parts }) => {
    //console.log(parts)
    return (
      <div>
        <Part parts={parts} />
      </div>
    );
  };
  
  const Total = (props) => {
    return (
      <p>
        <b>
          total of{" "}
          {props.parts.reduce((total, part) => total + part.exercises, 0)}{" "}
          exercises
        </b>
      </p>
    );
  };
  
  const Course = (props) => {
    return (
      <div>
        <Header course={props.course.name} />
        <Content parts={props.course.parts} />
        <Total parts={props.course.parts} />
      </div>
    );
  };
  
  
  export default Course;