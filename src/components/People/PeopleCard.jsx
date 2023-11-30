function PeopleCard ({people}){
    return (
        <div className="client-data">
            <div className='client-main'>
                <img src={people.image ?? "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Clipart.png"} alt="" />
                <p>{`${people.names} ${people.lastnames}`}</p>
                <p>{people.identification}</p>
            </div>
            <div className='client-info'>
            {people.identification && (
                <p>Identificación: {people.identification}</p>
            )}
            {people.birthdate && (
                <p>Fecha de nacimiento: {people.birthdate}</p>
            )}
            {people.email && (
                <p>Corrreo electronico: {people.email}</p>
            )}
            {people.address && (
                <p>Direccion: {people.address}</p>
            )}
            {people.mobile && (
                <p>Numero de telefono: {people.mobile}</p>
            )}
            {people.weight && (
                <p>Peso corporal: {people.weight} KG</p>
            )}
            {people.height && (
                <p>Altura: {people.height} CM</p>
            )}
            {people.bloodType && (
                <p>Tipo de sangre: {people.bloodType}</p>
            )}
            {people.gender && (
                <p>Genero: {people.gender}</p>
            )}
            {people.paymentStatus && (
                <p>Estado de pago: {people.paymentStatus}</p>
            )}
            </div>
        </div>
    )
}

export default PeopleCard;