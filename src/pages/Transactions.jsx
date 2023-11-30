import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PeopleCard from "../components/People/PeopleCard";
import Modal from "../components/Utils/Modal";
import { ENV } from "../shared/constants/services";
import { GetPeople } from "../shared/services/People/getPeople";
import { GetTransactions } from "../shared/services/Transactions/getTransactions";
import DataTable from "../components/Utils/DataTable";
import TransactionForm from "../components/Transactions/TransactionForm";

function Transactions() {
  document.title = 'Power House | Transacciones';
  const { identification } = useParams();

  const [people, setPeople] = useState(null);

  const [data, setData] = useState({
    content: [],
    headers: [],
    total: 0
  });

  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10
  })

  const [showModal, setShowModal] = useState(false);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    const getPeople = new GetPeople();
    const getTransactions = new GetTransactions();

    const headers = [
      { name: 'ID', access: 'id' },
      { name: 'Fecha de inicio', access: 'startDate' },
      { name: 'Fecha de finalización', access: 'endDate' },
      { name: 'Valor', access: 'value' }
    ]

    getPeople.byIdentification({ identification }).then((people) => {
      setPeople(people);
      setPending(people.paymentStatus.toLowerCase() === 'pendiente');
      getTransactions.withPagination({ ...pagination, peopleId: people.id }).then((transactionsPaginated) => {
        setData({
          content: transactionsPaginated.data,
          headers,
          total: transactionsPaginated.total
        });
      }).catch((e) => {
        if (ENV === 'dev') {
          console.error(e);
        }
        setData({
          content: [],
          headers,
          total: 0
        });
      });

    }).catch((e) => {
      if (ENV === 'dev') {
        console.error(e);
      }
    });
  }, [identification, pagination]);

  const toggleModal = () => {
    setShowModal((oldShow) => !oldShow);
  }

  return (
    <>
      {showModal && (
        <Modal onClose={toggleModal}>
          <TransactionForm setData={setData} toggleModal={toggleModal} peopleId={people.id} pagination={pagination} setPagination={setPagination} />
        </Modal>
      )}
      {people && (<PeopleCard people={people} />)}
      <div className="transactions_table">
      <button className={`${pending ? 'primary' : 'danger'}`} onClick={toggleModal}>{pending ? ('Nuevo') : ('YA PAGADO')}</button>
      <div className="overflow_table">
        <DataTable data={data} model={'Transacciones'} pagination={pagination} setPagination={setPagination} />
      </div>
      </div>
    </>
  )
}

export default Transactions;