const Sequelize = require("sequelize");
const { DataTypes, Op } = Sequelize;
const bcrypt = require("bcrypt");
const zlib = require("zlib");

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

// ///아래와 같이 connect가 성공했는지 알 수 있다
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("connection successful!");
//     //여기서 성공 메세지가 뜬다면 우리가 mysql에서
//     // 만든 데이터베이스랑 잘 연결 됐다는 말이다
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
      //username를 4글자에서 5글자 사이로 한다고 치자,
      // 근데 bulkCreate는 이 validate를 무시하고 data를 insert하게 되니까 주의하자
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
    // //만약 우리가 지은 이름하고 mysql하고 같은 이름으로 테이블을 만들고
    // 싶다면 이 freezeTableName을 3번째 매개변수로 넣어주면 됨, 보통 단수로
    // 만들어도 복수로 표시됨
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
// const user = User.build({
//   username: "Seungyeon Ji",
//   password: "123",
//   age: 25,
//   wittCodeRocks: true,
// });
// return user.save();

//     //이런 data를 한번에 많이 넣고 싶다면 bulkCreate([{객체 1},{객체2}])로 만들면 된다 그래서 해당 return값을 바로 data.toJSON()로는 못 받고 한번 map으로 돌려서 그 값으로 toJSON()을 받아야 한다
//   return User.create({
//     username: "Changju",
//     password: "1234123",
//     age: 21,
//     wittCodeRocks: false,
//   });
// })
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
// User.sync({ alter: true })
//   .then(() => {
//     //특정 attributes의 정보만 얻을 수 있음
//     // return User.findAll({
//     //   attributes: [
//     //     ["username", "myName"],
//     //     ["password", "pwd"],
//     //   ],
//     // });

//     //만약에 해당 데이터에서 AVG와 SUM을 하고 싶을때는 아래와 같이하면 된다
//     //attributes는 복수로 써야 한다

//     /////////////////////////FIND DATA/////////////////////////////
//     // return User.findAll({
//     //   // attributes: [[sequelize.fn("AVG", sequelize.col("age")), "howOld"]],
//     //   ///////exclude
//     //   // attributes: { exclude: ["password"] },
//     //   ///////where 더 찾고 싶은 필터가 있으면 where에 더 넣어주면 된다
//     //   // attributes: ["username"],
//     //   // where: { age: 25 },
//     //   //////limit 라고 하면 처음 두개만 보여준다
//     //   // limit: 2,
//     //   //////Order age를 기준으로 큰 순서가 위로 오도록 설정, (ASC, DESC) 사용가능
//     //   // order: [["age", "DESC"]],
//     //   //해당 group은 username과 sum_age를 그룹으로 보여준다?
//     //   // attributes: [
//     //   //   "username",
//     //   //   [sequelize.fn("SUM", sequelize.col("age")), "sum_age"],
//     //   // ],
//     //   // group: "username",
//     //   ///op사용 방법 만약 username이 pizza이며 age가 몇살? 같은 특정 요소를 찾는 method는 Op를 사용한다, 이 경우에는 두개의 조건이 충족되는 것이 아니라 둘중에 하나만 해당되면 해당 결과를 리턴해준다, 만약 둘다 충족되는 것을 찾을 때는 Op.and를 사용해야 한다, 하지만 이 경우에는 이렇게 코딩해도 괜찮다 where : {username: 'soccer', age: 45}
//     //   // where: { [Op.or]: { username: "pizza", age: 21 } },

//     //   //// 숫자 크거나 작거나를 찾을 때 사용할 수 있는 코드, age가 25보다 많은것을 이렇게 표현한다,
//     //   // where: { age: { [Op.gt]: 25 } },

//     //   // 좀더 복잡한 조건을 만들 떄는 아래와 같이 만든다
//     //   // where: {
//     //   //   age: {
//     //   //     [Op.or]: {
//     //   //       [Op.lt]: 21,
//     //   //       [Op.eq]: null,
//     //   //     }
//     //   //   }
//     //   // }

//     //   //그럼 만약 우리 data중에 6개의 글자를 가진 데이터를 찾고 싶을 때는 어떻게 해야 할까? 아래와 같이 하면 할 수 있다
//     //   where: sequelize.where(
//     //     sequelize.fn("char_length", sequelize.col("username")),
//     //     5
//     //   ),
//     // });

//     ///////////////////////////////UPDATE DATA//////////////////////////////
//     //이렇게 코딩을 하게 되면 username을 Yes!로 바꾸는데 에이지가 1살 보다 많은 녀석들은 코드를 바꾸겠다는 소리임
//     //   return User.update(
//     //     {
//     //       username: "Yes!",
//     //     },
//     //     {
//     //       where: {
//     //         age: {
//     //           [Op.gt]: 1,
//     //         },
//     //       },
//     //     }
//     //   );
//     // })

//     /////////////////////////////////DELETE////////////////////////////////
//     //만약 다 지우고 싶다면 truncate: true로 하면 된다
//     return User.destroy({
//       where: { username: "Yes!" },
//     });
//   })
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

/////////////////Create Table//////////////////
const Student = sequelize.define("students", {
  student_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [4, 20],
    },
    //이렇게 get method를 이용해서 유저 이름을 계속 capital로 바꿀 수 있다.
    //여기서 주의할 점은 이는 data 자체를 바꾸는 것은 아니고 데이터가 display되는
    //걸 바꾸는 것 뿐이다
    get() {
      //여기서 rawValue = this.name을 해버리면 infinity loop에 빠지게 될 것이다.
      const rawValue = this.getDataValue("name");
      return rawValue;
    },
    //setter은 hash the password that is being stored 할 때 유용하게 쓸 수 있다
  },
  // sequelize에서는 열을 추가할 때는 마이그레이션을 통해 수행해야 한다
  // password: {
  //   type: DataTypes.STRING,
  //   set(value) {
  //     const salt = bcrypt.genSaltSync(12);
  //     const hash = bcrypt.hashSync(value, salt);
  //     this.setDataValue("password", hash);
  //   },
  // },
  favorite_class: {
    type: DataTypes.STRING(25),
    defaultValue: "Computer science",
  },
  school_year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  subscribed_to_wittcode: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  description: {
    type: DataTypes.STRING,
  },
});

Student.sync({ alert: true })
  .then(() => {
    // return Student.findAll();
    //원래는 이렇게 findAll로 query를 하게 되면 해당 data에서 필요한 데이터뿐만 아니라 다른 이상한 데이터도 출력하기 때문에 아래와 같이 toJSON()을 이용해야 한다, 하지만 raw라는 method를 쓰게 되면 이러한 작업은 필요없게 된다
    // return Student.findAll({
    //   where: { name: "Seungyeon Ji" },
    //   raw: true,
    // });
    //findByPk(find by using primary key)
    // return Student.findByPk(2);
    //findOne() 한개만 찾는다, 가장 위에 있는 녀석으로
    //findOrCreate() 만약 해당 조건의 충족하는 row가 있으면 찾고 없으면 만든다
    //찾는 조건에 맞는 녀석을 모두 리턴하되 그리고 그 리턴된 녀석의 숫자까지 세어준다
    //findAndCountAll() => data에서 count라는 객체를 반환하여 그것을 디스트럭트 해서 사용할 수 있게 해준다
    // return Student.create({
    //   name: "hello kim",
    //   school_year: 5,
    //   description: "hello",
    // });
  })
  .then((data) => {
    //만약 data가 새로 생성되었다면 created는 true를 리턴할 것이고 아니면 false를 리턴하게 될 것이다. 실제로 데이터 생성 유무를 확인할 때 유용하게 쓸 수 있음.
    // const { count, rows } = data;
    // console.log(count);
    // console.log(rows);
  })
  .catch((err) => {
    console.log(err);
  });

//어떻게 create를 쓰는지 모름, 여러 데이터의 경우에는 bulkCreate()의 method를 사용해야 한다

//만약 data를 query하게 되면 같은 sync함수에 then을 붙여서 가지고 와야 하냐, 아니면 같은 scop에서 가지고 와야 하나

//추가를 하고 추가한 녀석의 로직을 삭제한 후 그 안에 query가 들어가는 거임

//setter과 getter을 같이 쓸 데 유용한 것은 compression 하고 uncompression과 같은 작업을 수행할 때인데 만약 내용이 긴 posting과 같은 작업을 수행할때 해당 데이터는 길기 때문에 compression을 setter으로 설정하고 uncompression으로 해당 데이터를 원래대로 돌려놔서 data을 back할 수 있도록 하는 것이다 => 모듈 zlib을 사용한다

///////이게 compress의 예제 코드이다/////////
// description: {
//   type: DataTypes.STRING,
//   set(value) {
//     const compressed = zlib.deflateSync(value).toString('base64');
//     this.setDataValue('description', compressed)
//   },
// get() {
//   const value = this.getDataValue('description');
//   const uncompressed = zlib.inflateSync(Buffer.from(value, 'base64'))
//   return uncompressed.toString()
// }
// }
