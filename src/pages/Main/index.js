import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import Container from '../../components/Container';
import { Form, SubmitButton, List } from './styles';

export default class Main extends Component {
    state = {
        newRepo: '',
        repositories: [],
        loading: false,
    };

    async componentDidMount() {
        const repositories = localStorage.getItem('repositories');

        if (repositories) {
            this.setState({ repositories: JSON.parse(repositories) });
        }

        try {
            const response = await api.get('/popular?api_key=bb877ef70b973ed90e1287cefdcf44f7&language=pt-BR&page=1');
            this.setState({ repositories: response.data.results })
            console.log(response.data.results);
        } catch (err) {
            console.log(err)
        }
    }

    componentDidUpdate(_, prevState) {
        const { repositories } = this.state;

        if (prevState.repositories != repositories) {
            localStorage.setItem('repositories', JSON.stringify(repositories));
        }
    }

    handleInputChange = e => {
        this.setState({ newRepo: e.target.value })
    };

    handleSubmit = async e => {
        e.preventDefault();

        this.setState({ loading: true })

        const { newRepo, repositories } = this.state

        const response = await api.get(`/repos/${newRepo}`)

        const data = {
            name: response.data.full_name,
        };

        this.setState({ repositories: [...repositories, data], newRepo: '', loading: false });
    };

    render() {
        const { newRepo, loading, repositories } = this.state;
        console.log({ repositories })

        return (
            <Container>
                <h1>
                    <FaGithubAlt />
                    Últimos filmes lançados
                </h1>

                <List>
                    {repositories.map(repository => (
                        <li key={repository.title} >
                            <span>{repository.title}</span>
                            <Link to={`/detalhe/${encodeURIComponent(repository.id)}`}>Detalhes</Link>
                        </li>
                    ))}
                </List>
            </Container>
        );
    }
}
