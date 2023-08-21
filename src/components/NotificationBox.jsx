function NotificationBox({notificationBox}){
    return (
        <div id='notificationBox'>
            <h2>{notificationBox.header}</h2>
            <p>{notificationBox.body}</p>
        </div>
    )
}

export default NotificationBox;