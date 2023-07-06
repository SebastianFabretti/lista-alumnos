const url = "https://D940-181-231-122-56.ngrok-free.app/student";

window.onload = function(){
  getStudents()
} //Esto es mas comodo que usar botones, ver despues

function loadStudents(url) { //La funcion de cargar y traer los datos. Le pasamos la url por parametro
    return new Promise(function (resolve, reject) {
      var request = new XMLHttpRequest();
      request.open("GET", url + "/getAll"); //Le añadimos un endpoint
      request.responseType = "json";
      request.onload = function () {
        if (request.status == 200) {
          resolve(request.response);
        } else {
          reject(
            Error("Image could not be loaded. Error: " + request.statusText)
          );
        }
      };

      request.onerror = function () {
        reject(Error("Oops!, there was a network error."));
      };
      request.send();
    });
  }


  function getStudents(){
    loadStudents(url).then((response) => {
    var tbody = document.querySelector('tbody')
    tbody.innerHTML = ""
    response.forEach(element => { //con esto, podemos recorrer el JSON 
        var row = tbody.insertRow()
        var id = row.insertCell()
        id.innerHTML = element.id
        var dni = row.insertCell()
        dni.innerHTML = element.dni
        var apellido = row.insertCell()
        apellido.innerHTML = element.lastName
        var nombre = row.insertCell()
        nombre.innerHTML = element.firstName
        var email = row.insertCell()
        email.innerHTML = element.email
        var student = JSON.stringify({
          'id': element.id,
          'dni': element.dni, 
          'lastName': element.lastName,
          'firstName': element.firstName,
          'email': element.email,
        })

        
        var botonVer = row.insertCell();
        botonVer.innerHTML = "<button onclick = 'viewStudent("+student+")'>ver</button>"
        var botonBorrar = row.insertCell();
        botonBorrar.innerHTML = "<button onclick = 'deleteStudent("+element.id+")'>borrar</button>"

        /*document.getElementById('dni').value = ''
        document.getElementById('apellido').value = ''
        document.getElementById('nombre').value = ''
        document.getElementById('email').value = ''
        document.getElementById('dni').focus()*/
    });
  })
  .catch((reason) => {
    console.log(Error(reason));
  })
}


  function addStudent() {
    return new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest()
        request.open('POST', url)
        request.setRequestHeader('Content-Type', 'application/json')
        var student = JSON.stringify({
            'dni': document.getElementById('dni').value,
            'lastName': document.getElementById('lastName').value,
            'firstName': document.getElementById('firstName').value,
            'email': document.getElementById('email').value,
            'cohort': '0',
            'status': 'activo',
            'gender': 'x',
            'address': 'a',
            'phone': '3'
        })
        request.onload = function() {
            if (request.status == 201) {
                resolve(request.response)
            } else {
                reject(Error(request.statusText))
            }
        }
        request.onerror = function() {
            reject(Error('Error: unexpected network error.'))
        }
        request.send(student)
    })
}

function removeStudent(id) {
  return new Promise(function(resolve, reject) {
    var request = new XMLHttpRequest()
    request.open('POST', url + "/" + id + "/delete")
    request.setRequestHeader('Content-Type', 'application/json')
    request.onload = function() {
        if (request.status == 200) {
            resolve(request.response)
        } else {
            reject(Error(request.statusText))
        }
    }
    request.onerror = function() {
        reject(Error('Error: unexpected network error.'))
    }
    request.send()
  })
}

function deleteStudent(id) {
  removeStudent(id).then(() => {
      getStudents()
  }).catch(reason => {
      console.error(reason)
  })
}

function newStudent() {
  addStudent().then(() => {
      getStudents()
      document.getElementById("dni").value = ""
      document.getElementById("lastName").value = ""
      document.getElementById("firstName").value = ""
      document.getElementById("email").value = ""
  }).catch(reason => {
      console.error(reason)
  })
}

function modifyStudent() {
  return new Promise(function(resolve,reject){
    var request = new XMLHttpRequest()
    request.open('POST', url + `/${document.getElementsByName('id2')[0].value}/update`)
    request.setRequestHeader('Content-Type', 'application/json')
    var student = JSON.stringify({
      'dni': document.getElementsByName('dni2')[0].value,
      'lastName': document.getElementsByName('lastName2')[0].value,
      'firstName': document.getElementsByName('firstName2')[0].value,
      'email': document.getElementsByName('email2')[0].value,
      'cohort': '0',
      'status': 'activo',
      'gender': 'masculino',
      'address': 'abc123',
      'phone': '000'
    })
    request.onload = function(){
      if (request.status==200){
        resolve(request.resolve)
      }
      else{
        reject(Error(request.statusText))
      }
    }
    request.onerror = function(){
      reject(Error('Error: unexpected network error.'))
    }
    request.send(student)
  })
}

function updateStudent() {
  if (document.getElementsByName('dni2')[0].value.trim() !== '' &&
      document.getElementsByName('lastName2')[0].value.trim() !== '' &&
      document.getElementsByName('firstName2')[0].value.trim() !== '' &&
      document.getElementsByName('email2')[0].value.trim() !== '') {
      modifyStudent().then(() => {
          $('#popUp').dialog('close')
          getStudents()
      }).catch(reason => {
          console.error(reason)
      })
  }
}

function viewStudent(student) {
  document.getElementsByName('id2')[0].value = student.id
  document.getElementsByName('dni2')[0].value = student.dni
  document.getElementsByName('lastName2')[0].value = student.lastName
  document.getElementsByName('firstName2')[0].value = student.firstName
  document.getElementsByName('email2')[0].value = student.email
  $('#popUp').dialog({
      closeText: ''
  }).css('font-size', '15px')
}