export const getUserId = () => {
    let id = localStorage.getItem("sh-user-id");
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem("sh-user-id", id);
    }
    return id;
};