import React from "react";
import { nanoid } from "nanoid";
import { getDatabase, child, ref, set, get } from "firebase/database";
import { isWebUri } from "valid-url";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            longURL: '',
            preferedAlias: '',
            generatedURL: '',
            loading: false,
            errors: [],
            errorMessages: {},
            toolTipMessage: 'Copier dans le presse-papier'
        }
    }

    // Quand l'utilisateur clique sur valider
    onSubmit = async (event) => {
        event.preventDefault(); // On ne veut pas que la page recharge
        this.setState({
            loading: true,
            generatedURL: ''
        });

        // Pour valider l'input utilisateur
        var isFormValid = await this.validateInput();
        if (!isFormValid) {
            return
        }
        var generatedKey = ''
        // Si l'user a entré un URL préférentiel, on l'utilise sinon on en génère un
        this.state.preferedAlias !== '' ? generatedKey = this.state.preferedAlias : generatedKey = nanoid(5);
        var generatedURL = "refineit-549b93aec3ac.herokuapp.com/" + generatedKey;

        const db = getDatabase();
        set(ref(db, '/' + generatedKey), {

            generatedKey: generatedKey,
            longURL: this.state.longURL,
            preferedAlias: this.state.preferedAlias,
            generatedURL: generatedURL
        }).then(() => {
            this.setState({
                generatedURL: generatedURL,
                loading: false
            })
        }).catch((e) => {
            // code erreur à créer
        })
    }

    // On vérifie les erreurs
    hasError = (key) => {
        return this.state.errors.indexOf(key) !== -1;
    }

    // On enregistre le contenu a fur et à mesure que l'user écrit
    handleChange = (e) => {
        const { id, value } = e.target;
        this.setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    validateInput = async () => {
        var errors = [];
        var errorMessages = this.state.errorMessages;

        // on valide la longue URL
        if (this.state.longURL.length === 0) {
            errors.push('longURL');
            errorMessages['longURL'] = "Veuillez entrer votre URL"
        } else if (!isWebUri(this.state.longURL)) {
            errors.push('longURL');
            errorMessages['longURL'] = "Veuillez entrer une URL valide de la forme https://www..."
        }


        // on valide l'URL préférentielle
        if (this.state.preferedAlias !== '') {

            if (this.state.preferedAlias.length > 10) {
                errors.push('preferedAlias');
                errorMessages['preferedAlias'] = "Alias limité à 10 caractères maximum"
            } else if (this.state.preferedAlias.indexOf(' ') >= 0) {
                // TODO gérer les accents
                errors.push('preferedAlias');
                errorMessages['preferedAlias'] = "Veuillez retirer les espaces et les accents"
            }

            var keyExists = await this.checkKeyExists();

            if (keyExists.exists()) {
                errors.push('preferedAlias');
                errorMessages['preferedAlias'] = "Cet alias existe déjà. Veuillez en entrer un nouveau";
            }
        }

        this.setState({
            errors: errors,
            errorMessages: errorMessages,
            loading: false
        });

        if (errors.length > 0) {
            return false
        }
        return true
    }

    checkKeyExists = async () => {
        const dbRef = ref(getDatabase());
        return get(child(dbRef, `/${this.state.preferedAlias}`)).catch((error) => {
            return false
        });
    }

    copyToClipboard = () => {
        navigator.clipboard.writeText(this.state.generatedURL);
        this.setState({
            toolTipMessage: "Copié !"
        });
    }

    render() {
        return (
            <div className="container">
                <form autocomplete="off">
                    <h3>Refine it !</h3>
                    <div className="form-group">
                        <label> Entrez votre longue URL</label>
                        <input
                            id="longURL"
                            onChange={this.handleChange}
                            value={this.state.longURL}
                            type="url"
                            required
                            className={this.hasError("longURL") ? "form-control is-invalid" : "form-control"}
                            placeholder="https://wwww..."
                        />
                    </div>
                    <div className={this.hasError('longURL') ? "text-danger" : "visually-hidden"} >{this.state.errorMessages.longURL}</div>
                    <div className="form-group">
                        <label htmlFor="basic-url"> Votre URL réduite</label>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text">refineit-549b93aec3ac.herokuapp.com/</span>
                            </div>
                            <input
                                id="preferedAlias"
                                onChange={this.handleChange}
                                value={this.state.preferedAlias}
                                type="text"
                                className={this.hasError("preferedAlias") ? "form-control is-invalid" : "form-control"}
                                placeholder="eg. efY3j (optionel)"
                            />
                        </div>
                    </div>
                    <div className={this.hasError('preferedAlias') ? "text-danger" : "visually-hidden"} >{this.state.errorMessages.preferedAlias}</div>
                    <button className="btn btn-primary" type="button" onClick={this.onSubmit}>
                        {
                            this.state.loading ?
                                <div>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                </div> :
                                <div>
                                    <span className="visually-hidden spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    <span>Refine it !</span>
                                </div>
                        }
                    </button>
                    {
                        this.state.generatedURL === '' ?
                            <div></div> :
                            <div className="generatedurl">
                                <span>Votre URL raffinée est :</span>
                                <div className="input-group mb-3">
                                    <input disabled type="text" value={this.state.generatedURL} className="form-control" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                                    <div className="input-group-append">
                                        <OverlayTrigger
                                            key={'top'}
                                            placement={'top'}
                                            overlay={
                                                <Tooltip id={`tooltip-${'top'}`}>
                                                    {this.state.Tooltip}
                                                </Tooltip>
                                            }>
                                            <button onClick={() => this.copyToClipboard()} data-toggle="tooltip" data-placement='top' title="tooltip on top" className="btn btn-outline-secondary" type="button">Copier</button>
                                        </OverlayTrigger>
                                    </div>
                                </div>
                            </div>
                    }
                </form>
            </div>
        )
    }
}

export default Form;