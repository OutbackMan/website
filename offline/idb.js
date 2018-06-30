const IDB_CONFIG = Object.freeze({
	"WANT_DEBUG": true,
	"NAME": "test-idb",
	"VERSIONS": {
    "CREATE_KEY_VAL_STORE": 0,
	  "CREATE_PEOPLE": 1,
	  "CREATE_PEOPLE_INDEX": 2
  },
	"CURRENT_VERSION": 2,
});

function idb__version1_upgrade(idb) {
	let key_val_store = idb.createObjectStore("key-val");
	key_val_store.transaction.oncomplete = (event) => {
	  let key_val_store_tx = idb.transaction("key-val", "readwrite").objectStore("key-val");
		key_val_store_tx.put("world-value", "hello-key");
	}
}

function idb__version1to2_upgrade(idb) {
	let people_store = idb.createObjectStore("people", {keyPath: "name"});
	people_store.transaction.oncomplete = (event) => {
	  let people_store_tx = idb.transaction("people", "readwrite").objectStore("people");
		people_store_tx.put({
				name: "Ryan McClue",
				age: 22,
				height: 190
		});
		people_store_tx.put({
				name: "Jazz McClue",
				age: 10,
				height: 90 
		});
		people_store_tx.put({
				name: "Lachlan McClue",
				age: 19,
				height: 188
		});

		people_store_tx.createIndex("height-index", "height");
		let height_index = people_store_tx.index("height-index");
		// console.log(height_index.getAll());
		// openCursor() can also be called on just an object store
		height_index.openCursor().onsuccess = (event) => {
				let cursor = event.target.result;
				if (cursor) {
						console.log(cursor.value.height);
						cursor.continue();
				} else {
						console.log("no more entries");			
				}
		}
	}
}

// only required if the entire site cannot be viewed offline
function idb_create(idb_name, current_version) {
	let idb_request = indexedDB.open(idb_name, current_version);

	idb_request.onupgradeneeded = (event) => {
		let idb = event.target.result;		

		switch (event.oldVersion) {
		case IDB_CONFIG.VERSIONS.CREATE_KEY_VAL_STORE: 
		  idb__create_key_val_store(idb);
		case IDB_CONFIG.VERSIONS.CREATE_PEOPLE_STORE:
		  idb__create_people_store(idb);
		case IDB_CONFIG.VERSIONS.CREATE_PEOPLE_INDEX:
		}

	}

	idb_request.onsuccess = (event) => {
		event.target.result.close();	
	}

	idb_request.onerror = (event) => {
		console.error(`Indexed DB error: ${event.target.errorCode}`);
	}

}


(() => {
  idb_create(IDB_CONFIG.NAME, IDB_CONFIG.CURRENT_VERSION);		
})();
