import { ENV } from "../../shared/constants/services";
import { useState } from "react"
import { PersistTransaction } from "../../shared/services/Transactions/persistTransactions";
import FormComponent from "../Forms/FormComponent";
import FormField from "../Forms/FormField";
import { GetTransactions } from "../../shared/services/Transactions/getTransactions";

function TransactionForm({ toggleModal, peopleId, setData = null, setPagination = null, pagination = null }) {

  const [transaction, setTransaction] = useState({ peopleId });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'startDate') setTransaction({ ...transaction, startDate: value });
    if (name === 'endDate') setTransaction({ ...transaction, endDate: value });
    if (name === 'value') setTransaction({ ...transaction, value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const persistTransaction = new PersistTransaction();
    persistTransaction.create({ data: transaction })
      .then((res) => {
        const getTransactions = new GetTransactions();
        getTransactions.withPagination(pagination).then((transactionsPaginated) => {
          setData((oldData) => {
            return {
              ...oldData,
              content: transactionsPaginated.data,
              total: transactionsPaginated.total
            }
          });
          setPagination((oldPagination) => {
            return {
              ...oldPagination,
              page: transactionsPaginated.page,
              perPage: transactionsPaginated.perPage
            }
          })
          toggleModal(); 
        }).catch((e) => {
            if (ENV === 'dev') {
              console.error(e);
            }
            setData((oldData) => {
              return {
                ...oldData,
                content: [],
                total: 0
              }
            });

            setPagination((oldPagination) => {
              return {
                ...oldPagination,
                page: 1
              }
            })
          });
      })
      .catch((e) => {
        if (ENV === 'dev') {
          console.error(e);
        }
        if (e.response?.data) setErrors(e.response.data);
      });
  }

  return (
    <FormComponent model="Transacción" handleSubmit={handleSubmit} className="grid c2_1fr">
      <FormField errors={errors.startDate} label={'Fecha de inicio'} spanClass="span_in">
        <input
          type="date"
          name="startDate"
          onChange={handleInputChange}
        />
      </FormField>
      <FormField errors={errors.endDate} label={'Fecha de finalización'} spanClass="span_in">
        <input
          type="date"
          name="endDate"
          onChange={handleInputChange}
        />
      </FormField>
      <FormField errors={errors.value} label={'Valor'} spanClass="span_in">
        <input
          type="number"
          name="value"
          onChange={handleInputChange}
          placeholder="Valor"
        />
      </FormField>
    </FormComponent>
  )

}

export default TransactionForm;