import { API_URL } from "../consts";
import axios from "../utils/axios";
import { useState } from "react"

function TransactionForm ({toggleModal,setTransactions,peopleId}){

    const [transaction,setTransaction]=useState({peopleId});

    const handleInputChange = (e)=>{
        const {name,value}=e.target;
        if (name === 'startDate') setTransaction({...transaction, startDate: value});
        if (name === 'endDate') setTransaction({...transaction, endDate: value});
        if (name === 'value') setTransaction({...transaction, value});
    }

    const handleSubmit = (e)=>{
        e.preventDefault();
        axios.post(`${API_URL}/transactions/create/`, transaction)
            .then((res)=>{
                const {id} = res.data;
                axios.get(`${API_URL}/transactions/${id}/`)
                    .then((res) => {
                        setTransactions((oldTransactions) => [...oldTransactions, res.data]);
                        toggleModal();
                    })
                    .catch((e) => console.error(e));
            })
            .catch((e) => console.error(e));
    }

    return(
        <div>
            <h2>Agregar Membresia</h2>
            <form onSubmit={handleSubmit}>
                <input 
                type="date"
                name="startDate"
                onChange={handleInputChange}
                required
                />

                <input 
                type="date"
                name="endDate"
                onChange={handleInputChange}
                required
                />

                <input 
                type="number"
                name="value"
                onChange={handleInputChange}
                required
                />
                <button>Enviar</button>
            </form>
        </div>
         )

}

export default TransactionForm;