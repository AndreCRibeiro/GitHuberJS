import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import Container from '../../components/Container';
import { Form, SubmitButton, List } from './styles';

export default class Main extends Component {
    state = {
        newRepo: '',
        repositories: [],
        filter: false,
        loading: false,
    };

    async componentDidMount() {
        const repositories = localStorage.getItem('repositories');

        if (repositories) {
            this.setState({ repositories: JSON.parse(repositories) });
        }

        try {
            const response = await api.get('/movie/popular?api_key=bb877ef70b973ed90e1287cefdcf44f7&language=pt-BR&page=1');
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

        // this.setState({ loading: true })

        const { newRepo, repositories } = this.state

        // const response = await api.get(`/repos/${newRepo}`)
        try {
            const response = await api.get(`/search/movie?api_key=bb877ef70b973ed90e1287cefdcf44f7&language=pt-BR&query=${newRepo}&page=1&include_adult=false`);
            this.setState({ filter: response.data.results })
            console.log({ response });
        } catch (err) {
            console.log(err)
        }

        //const data = {
        //    name: response.data.full_name,
        //};

        // this.setState({ repositories: [...repositories, data], newRepo: '', loading: false });
    };

    render() {
        const { newRepo, loading, repositories, filter } = this.state;
        console.log({ filter })

        return (
            <Container>
                <h1>
                    <FaGithubAlt />
                    Últimos filmes lançados
                </h1>
                <Form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        placeholder="Adicionar repositório"
                        value={newRepo}
                        onChange={this.handleInputChange}
                    />

                    <SubmitButton loading={loading}>
                        {loading
                            ? (<FaSpinner color="#FFF" size={14} />)
                            : (<FaSearch color="#fff" size={14} />)
                        }
                    </SubmitButton>
                </Form>

                { filter ? (
                    <List>
                        {
                            filter.map(movie => (
                                <li key={movie.title} >
                                    <span>{movie.title}</span>
                                    <Link to={`/detalhe/${encodeURIComponent(movie.id)}`}>Detalhes</Link>
                                </li>
                            ))
                        }

                    </List>
                ) : (
                        <List>
                            {repositories.map(repository => (
                                <li key={repository.title} >
                                    <span>{repository.title}</span>
                                    <Link to={`/detalhe/${encodeURIComponent(repository.id)}`}>Detalhes</Link>
                                </li>
                            ))}
                        </List>
                    )
                }
            </Container>
        );
    }
}
