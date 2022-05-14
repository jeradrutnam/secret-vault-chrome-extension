import { useState } from "react";
import { FlexboxGrid, ButtonToolbar, Button, Message, Panel, List } from "rsuite";
import { useAuthContext } from "./AuthContext";

const styles = {
    marginTop: {
        marginTop: 20
    },
    marginBottom: {
        marginBottom: 20
    }
};

const App = () => {
    const { secureFetch, state, signIn, signOut } = useAuthContext();
    const [ userDetails, setUserDetails ] = useState(null);
    const [ errorMessage, setErrorMessage ] = useState("");

    const getUserInfo = () => {
        secureFetch("https://api.asgardeo.io/t/jerad/oauth2/userinfo?schema=openid")
            .then((data) => {
                console.log(data);
                setUserDetails(data);
                setErrorMessage("");
            })
            .catch((error) => {
                setErrorMessage(error);
            });
    };

    return (
        <FlexboxGrid justify="center" style={styles.marginTop}>
            <FlexboxGrid.Item colspan={10}>
                <Panel header={ <h3>Welcome {state?.username}</h3> } bordered>
                    { errorMessage !== "" &&
                        <Message showIcon type="error" header="Error" style={styles.marginBottom}>
                            { errorMessage }
                        </Message>
                    }
                    { !state?.username ? (
                        <ButtonToolbar>
                            <Button appearance="primary" onClick={ signIn }>Login</Button>
                            <Button appearance="ghost" onClick={ getUserInfo }>Try get user info</Button>
                        </ButtonToolbar>
                    ) : (
                        <ButtonToolbar>
                            { userDetails &&
                                <Panel bordered style={styles.marginBottom}>
                                    <List>
                                        { userDetails?.given_name && 
                                            <List.Item><strong>Name:</strong> { userDetails?.given_name }</List.Item>
                                        }
                                        { userDetails?.birthdate &&
                                            <List.Item><strong>Birth Day:</strong> { userDetails?.birthdate }</List.Item>
                                        }
                                    </List>
                                </Panel>
                            }
                            <Button appearance="primary"  onClick={ signOut }>Logout</Button>
                            <Button appearance="ghost" onClick={ getUserInfo }>Get user info</Button>
                        </ButtonToolbar>
                    )}
                </Panel>
            </FlexboxGrid.Item>
        </FlexboxGrid>
    );
}

export default App;
