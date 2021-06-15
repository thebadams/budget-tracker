let db
let version = 3

const req = indexedDB.open('BudgetTrackerDB', version)
req.onerror = (e) => {
  console.log(`Database Version ${version} has failed to open`);
}
req.onsuccess = (e) => {
  db = e.target.result
  console.log(`Database Version ${version} has been opened`);
  const tx = db.transaction('BudgetTrackerStore', 'readwrite')
  const store = tx.objectStore('BudgetTrackerStore');
  store.add({
  id: 1,
  name: "Test",
  value: 1000,
  date: Date.now()
})
  console.log(tx)
} 
req.onupgradeneeded = (e) => {
  db = e.target.result;
  const {oldVersion, newVersion} = e;
  console.log(`Database Has Been Upgraded From ${oldVersion} to ${newVersion}`)
  db.createObjectStore('BudgetTrackerStore', { autoIncrement: true, keyPath: "id"})
}

function checkDatabase() {
  console.log("Checking DB")
  let tx = db.transaction (['BudgetTrackerStore'], 'readwrite')

  const store = tx.objectStore('BudgetTrackerStore');

  const getAll = store.getAll();

  getAll.onsuccess = () => {
    if(getAll.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain',
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(res => {
        if(res.length !== 0) {
          transaction = db.transaction(['BudgetTrackerStore'], 'readwrite');
          const thisStore = transaction.objectStore('BudgetTrackerStore')
          thisStore.clear()
          console.log('Store Has Been Cleared');
        }
      })
    }
  }
}

function saveRecord(record) {
  console.log('Saving Record');

  const transaction = db.transaction(['BudgetTrackerStore'], 'readwrite')
  const store = transaction.objectStore('BudgetTrackerStore')
  store.add(record)

}

