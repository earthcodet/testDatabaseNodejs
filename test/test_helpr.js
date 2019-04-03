const mongoClient = require('mongodb').MongoClient
const url = 'mongodb://root:root123@ds131531.mlab.com:31531/pokemons'
const dbName = 'pokemons'
class WebDAO {
    getLatestGlobalData() {
        return new Promise((resolve, reject) => {
          mongoClient.connect(url, { useNewUrlParser: true }, (_err, client) => {
            const db = client.db(dbName)
            db.collection('GlobalData').find({}).sort({ _id: -1 }).limit(1).toArray((err, data) => {
                console.log('getLatestGlobalData [run]')
               
              if (err) { throw err }
              return resolve(data)
            })
          })
        })
      }
  insertCourse(course) {
      
                console.log('course.subjectId = '+course.subjectId)
    return new Promise((resolve, reject) => {
      mongoClient.connect(url, { useNewUrlParser: true }, (_err, client) => {
        const db = client.db(dbName)
        db.collection('Subject').findOne({ 'subject_ids': course.subjectId }, (err, data) => {
            console.log('insertCourse [run]')
            console.log('data = '+!data)
          if (err) { throw err }
          if (!data) {
            this.getLatestGlobalData().then((data) => {
                console.log('data.currentStudyYear = '+data[0].currentStudyYear)
                console.log('data.currentStudyTerm = '+data[0].currentStudyTerm)
              db.collection('Subject').findOneAndUpdate({ 'subject_id': course.subjectId }, {
                $push: {
                  "courses":
                  {
                    "school_year": data[0].currentStudyYear,
                    "courseId": 3,
                    "semester": data[0].currentStudyTerm,
                    "max_students": course.students,
                    "max_groups": course.groups
                  }
                }
              }, (err, data) => {
                  console.log('finish {insertData} = '+data)
                if (err) { throw err }
                return resolve(data)
              })
            })
          } else { return resolve(false) }
        })
      })
    })
  }

}

var AB = new WebDAO()
var a = []
a.subjectId = "88624459"
a.students = 120
a.groups =3

 


   AB.insertCourse(a).then(() =>{
        console.log('connecting')
      
    })
   
