const Sequelize = require("sequelize");
const { DataTypes } = Sequelize;

//여기 매개변수는 우리가 만든 db의 이름과 동일해야 한다
const sequelize = new Sequelize("sequelize-video", "root", "Emrehsdl12#", {
  dialect: "mysql",
  // define: {
  //   freezeTableName: true,
  //   //squelize는 다른 db와도 사용할 수 있기 때문에 어떤 데이터 베이스를 쓰는지 명시해줘야 한다
  //   // 모든 테이블에 적용된다 밑에 예는 user 테이블만 인데 여기 sequelize에 이렇게 define 객체에 freezeTableName을 넣으면 모든 테이블에 대한 이름이 우리가 만든데로 적용된다
  // },
});

//아래의 녀석을 async await로 만들면 이런 느낌이다
// async function myFunction() {
//   const result = await sequelize.authenticate();

//   if (result) console.log("connection successful!");
//   console.log("There is error!");
// }

///아래와 같이 connect가 성공했는지 알 수 있다
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("connection successful!");
//     //여기서 성공 메세지가 뜬다면 우리가 mysql에서 만든 데이터베이스랑 잘 연결 됐다는 말이다
//   })
//   .catch((err) => {
//     console.log("Error connecting to database!");
//   });

/////////////// Models 만들기//////////////////////
// sequelize.sync({ force: true }); //프로미스로 안하고 이렇게 간단하게 연동할 수도 있다

//regex /_test$/는 뒤에 테스트가 붙는 녀석만 지우는거임
// sequelize.drop({ match: /_test$/ }); // 이렇게 하면 모든 table을 지우게 된다

const User = sequelize.define(
  "user",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      //username를 4글자에서 5글자 사이로 한다고 치자, 근데 bulkCreate는 이 validate를 무시하고 data를 insert하게 되니까 주의하자
      validate: {
        len: [4, 5],
      },
    },
    password: {
      type: DataTypes.STRING,
    },
    age: {
      type: DataTypes.INTEGER,
      defaultValue: 21,
    },
    wittCodeRocks: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    freezeTableName: true,
    //만약 우리가 지은 이름하고 mysql하고 같은 이름으로 테이블을 만들고 싶다면 이 freezeTableName을 3번째 매개변수로 넣어주면 됨, 보통 단수로 만들어도 복수로 표시됨
    timestamps: false,
    //Don't add the updatedAt and createdAt attributes

    // tableName:'my_custom_name' --- define the table's name
    // version: true /// sequelize adds a version count attribute to the model and throws an OptimisticLockingError when stale instance are saved
    // paranoid: true---- don't delete database entries but set the attribute deletedAt to when the deletion was done. Only works if timestamps are enabled.
  }
);

//user 테이블을 지우는 방법
// User.drop();

/////////////////모델 연동 및 insert/////////////////////////////////
//이렇게 만든 models을 mysql에 넣으려면 model sync를 해줘야 한다
//여기서 force를 하면 기존의 user 데이터를 버리고 새로운 녀석으로 대체하게 됨, alter는 우리가 만든 model에 따라 만들어 준다
//force를 이용해서 기본 데이터를 만들어 준 후에 그 기본 데이터가 있는 상태에서 alter을 해줘야지 안그러면 오류가 뜬다
// User.sync({ alter: true })
//   .then(() => {
//     // working with our updated table. 이 작업은 단순히 insert할 수 있게 그 상태를 만들었다고 보면 되고, 실제로 insert는 save로 한다, 하지만 save하는데 시간이 걸리기 때문에 asyncronous way로 해야함, 하지만 이렇게 두개 따로 만드는 건 귀찮기 때문에 create가 존재함
//     // const user = User.build({
//     //   username: "Seungyeon Ji",
//     //   password: "123",
//     //   age: 25,
//     //   wittCodeRocks: true,
//     // });
//     // return user.save();

//     //이런 data를 한번에 많이 넣고 싶다면 bulkCreate([{객체 1},{객체2}])로 만들면 된다 그래서 해당 return값을 바로 data.toJSON()로는 못 받고 한번 map으로 돌려서 그 값으로 toJSON()을 받아야 한다
//     return User.create({
//       username: "Changju",
//       password: "1234123",
//       age: 21,
//       wittCodeRocks: false,
//     });
//   })
//   .then((data) => {
//     console.log(data);
//     //이 then 프로미스에서 데이터를 update혹은 delete할 수 있다, 하지만 그 때는 뒤에 또 다른 then이 와야 한다, 이렇게 바꿨다고 해도 data.reload() 메소드를 사용하면 username이 Changju에서 pizza로 바꼈다가 다시 Changju로 돌아간다, 그리고 save method에 save({fields: ['age']}) 로 작성하게 되면 username은 그대로고 age만 바뀌게 된다
//     // data.username = "pizze";
//     // data.age = 50;
//     // return data.save();
//     // return data.destroy();

//     //추가 되는 data의 나이를 2만큼 줄이고 추가한다
//     data.decrement({ age: 2 });
//   })
//   .then((data) => {
//     console.log("Update 성공!");
//     console.log(data);
//   })
//   .catch((err) => {
//     console.log("Error");
//   });

////////////////////////query////////////////////////////////////
User.sync({ alter: true })
  .then(() => {
    //특정 attributes의 정보만 얻을 수 있음
    // return User.findAll({
    //   attributes: [
    //     ["username", "myName"],
    //     ["password", "pwd"],
    //   ],
    // });

    //만약에 해당 데이터에서 AVG와 SUM을 하고 싶을때는 아래와 같이하면 된다
    //attributes는 복수로 써야 한다
    return User.findAll({
      // attributes: [[sequelize.fn("AVG", sequelize.col("age")), "howOld"]],
      ///////exclude
      // attributes: { exclude: ["password"] },
      ///////where 더 찾고 싶은 필터가 있으면 where에 더 넣어주면 된다
      // attributes: ["username"],
      // where: { age: 25 },
      //////limit 라고 하면 처음 두개만 보여준다
      // limit: 2,
      //////Order age를 기준으로 큰 순서가 위로 오도록 설정, (ASC, DESC) 사용가능
      order: [["age", "DESC"]],
    });
  })
  .then((data) => {
    data.forEach((e) => console.log(e.toJSON()));
  })
  .catch((err) => {
    console.log(err);
  });