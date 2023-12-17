import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GetMaintenances } from '../shared/services/Maintenances/getMaintenances';
import { ENV } from '../shared/constants/services';
import DataTable from '../components/Utils/DataTable';
import Modal from '../components/Utils/Modal';
import MaintenanceForm from '../components/Maintenances/MaintenanceForm';

export default function Maintenance() {
  document.title = 'Power House | Máquinas | Mantenimiento'
  const { id } = useParams();

  const [data, setData] = useState({
    content: [],
    headers: [],
    total: 0
  });

  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10
  });

  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    const getMaintenances = new GetMaintenances();

    getMaintenances.withPagination({ ...pagination, machineId: id }).then((maintenancePaginated) => {
      const headers = [
        { name: 'ID', access: 'id' },
        { name: 'Fecha de inicio', access: 'startDate' },
        { name: 'Fecha de finalización', access: 'endDate' },
        { name: 'Valor', access: 'value' }
      ];

      setData((oldData) => {
        return {
          ...oldData,
          content: maintenancePaginated.data,
          headers,
          total: maintenancePaginated.total
        }
      });
    }).catch((e) => {
      if (ENV === 'dev') console.error(e);
      setData((oldData) => {
        return {
          ...oldData,
          total: 0,
          content: []
        }
      });
    })
  }, [id, pagination]);

  const toggleModal = () => {
    setShowModal((oldShow) => !oldShow);
  }

  return (
    <>
      {showModal && (
        <Modal onClose={toggleModal}>
          <MaintenanceForm machineId={id} toggleModal={toggleModal} pagination={pagination} setData={setData} setPagination={setPagination}/>
        </Modal>
      )}
      <div className="overflow_table">
        <DataTable data={data} pagination={pagination} setPagination={setPagination} model={'Mantenimiento'} register_button toggleModal={toggleModal} />
      </div>
    </>
  )
}