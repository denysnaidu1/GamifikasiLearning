const db_config = {
     HOST:"localhost",
     USER:"root",
     PASSWORD:"12345678",
     DB:"elearning",
     dialect: "mysql",
     port:80,
     pool:{
          max:5,
          min:0,
          acquire:30000,
          idle:10000
     }
};

export default db_config;