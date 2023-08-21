function NotificationBox({notificationBox}){
    return (
        <div id='notificationBox'>
            <h1>{notificationBox.header}</h1>
            <p>{notificationBox.body}</p>
        </div>
    )
}

export default NotificationBox;