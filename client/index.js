import Web3 from 'web3';
import Crud from '../build/contracts/Crud.json';

let web3;
let crud;

//study this
const initWeb3 = () => {
  return new Promise((resolve, reject) => {
    if(typeof window.ethereum !== 'undefined') {
      const web3 = new Web3(window.ethereum);
      window.ethereum.enable()
        .then(() => {
          resolve(
            new Web3(window.ethereum)
          );
        })
        .catch(e => {
          reject(e);
        });
      return;
    }
    if(typeof window.web3 !== 'undefined') {
      return resolve(
        new Web3(window.web3.currentProvider)
      );
    }
    resolve(new Web3('http://localhost:9545'));
  });
};

const initContract = () => {
  const deploymentKey = Object.keys(Crud.networks)[0];
  return new web3.eth.Contract(
    Crud.abi, 
    Crud
      .networks[deploymentKey]
      .address
  );
};

const initApp = () => {
  const $create = document.getElementById('create');
  const $createResult = document.getElementById('create-result');

  const $read = document.getElementById('read');
  const $readResult = document.getElementById('read-result');

  const $change = document.getElementById('update');
  const $changeResult = document.getElementById('update-result');

  const $delete = document.getElementById('delete');
  const $deleteResult = document.getElementById('delete-result');

  let accounts = [];

  web3.eth.getAccounts()
    .then(_accounts => { // do this after getting accounts
      accounts = _accounts; // assigning results to accounts variable
    });

    $create.addEventListener('submit', e =>{ // emitting a call back function
      e.preventDefault(); // prevent the form from being submitted
      const name = e.target.elements[0].value;// all inputs and pick first one and access its value
      crud.methods
        .create(name)
        .send({from: accounts[0]})
        .then(() =>{
          $createResult.innerHTML = `New user ${name} was successfully created`;
        })
        .catch(() => {
          $createResult.innerHTML =`Sorry! There was an error while trying to create a new user`;
        })
    })

    $read.addEventListener('submit', e =>{ // emitting a call back function
      e.preventDefault(); // prevent the form from being submitted
      const name = e.target.elements[0].value;// all inputs and pick first one and access its value
      crud.methods
        .read(id)
        .call()
        .then(result =>{
          $readResult.innerHTML = `ID of user is ${result[0]} Name: ${result[1]}`; // 14:35 L19 review
        })
        .catch(() => {
          $readResult.innerHTML =`Sorry! There was an error while trying to read ${id}`;
        })
    })

    $change.addEventListener('submit', e =>{ // emitting a call back function
      e.preventDefault(); // prevent the form from being submitted
      const id = e.target.elements[0].value;// all inputs and pick first one and access its value
      const name = e.target.elements[1].value;
      crud.methods
        .update(id, name)
        .send({from: accounts[0]})
        .then(result =>{
          $changeResult.innerHTML = `User has been update to ID: ${result[0]} Name: ${result[1]}` ; // 14:35 L19 review
        })
        .catch(() => {
          $changeResult.innerHTML =`Sorry! There was an error while trying to update name of ${id} to ${name}`;
        })
    })

    $delete.addEventListener('submit', e =>{ // emitting a call back function
      e.preventDefault(); // prevent the form from being submitted
      const id = e.target.elements[0].value;// all inputs and pick first one and access its value
    
      crud.methods
        .destroy(id)
        .send({from: accounts[0]})
        .then(result =>{
          $deleteResult.innerHTML = `User ${result[0]} has been deleted` ; // 14:35 L19 review
        })
        .catch(() => {
          $deleteResult.innerHTML =`Sorry! There was an error while trying to delete ${id}`;
        })
    })
};

document.addEventListener('DOMContentLoaded', () => {
  initWeb3()
    .then(_web3 => {
      web3 = _web3;
      crud = initContract();
      initApp(); 
    })
    .catch(e => console.log(e.message));
});
