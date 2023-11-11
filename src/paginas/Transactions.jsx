import { useParams } from "react-router-dom";
import PeopleInformation from "../components/PeopleInformation";
import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { API_URL } from "../consts";
import Modal from "../components/Modal";
import TransactionForm from "../components/TransactionForm";

function Transactions () {
    const { identification } = useParams();

    const [people, setPeople] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [pending, setPending] = useState(true);

    useEffect(()=>{
        axios.get(`${API_URL}/people/${identification}/`)
            .then((res) => {
                setPeople(res.data);
                setPending(res.data.paymentStatus === 'Pendiente');
                    axios.get(`${API_URL}/transactions/people/${res.data.id}/`)
                    .then((res) => {
                        setTransactions(res.data);
                    })
                    .catch((e) => console.error(e));
            })
            .catch((e) => console.error(e));
        
    }, [identification, transactions.length]);

    const toggleModal = () => {
        setShowModal((oldShow) => !oldShow);
    }

    return (
        <>
        {showModal ? (
            <Modal onClose={toggleModal}>
                <TransactionForm setTransactions={setTransactions} toggleModal={toggleModal} peopleId={people.id}/>
            </Modal>
        ) : (
            <>
            {people && (<PeopleInformation people={people}/>)}

            <button onClick={toggleModal} disabled={!pending}>{pending ? ('Agregar') : ('YA PAGADO')}</button>

            <div>
                {transactions.length ? (
                    <table>
                        <thead>
                            <tr>
                                <th colSpan={4}>  
                                    TRANSACCIONES
                                </th>
                            </tr>
                            <tr>
                                <th>ID</th>
                                <th>Fecha de inicio</th>
                                <th>Fecha de finalizacion</th>
                                <th>Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction)=>{
                                return(
                                    <tr key={transaction.id}>
                                        <td>{transaction.id}</td>
                                        <td>{transaction.startDate}</td>
                                        <td>{transaction.endDate}</td>
                                        <td>{transaction.value}</td>
                                    </tr>
                                )
                            })}
                        </tbody>

                    </table>
                ) : (
                    <p>No hay transacciones realizadas...</p>
                )}
                
            </div>
            </>
        )}
        
        </>
        
    )
    
}

export default Transactions;