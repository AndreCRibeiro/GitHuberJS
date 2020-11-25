import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../services/api';

import Container from '../../components/Container';
import { Loading, Owner, IssueList } from './styles';

export default class Repository extends Component {
    static propTypes = {
        match: PropTypes.shape({
            params: PropTypes.shape({
                repository: PropTypes.string,
            }),
        }).isRequired,
    };

    state = {
        repository: {},
        issues: [],
        loading: true,
    }

    async componentDidMount() {
        const { match } = this.props;

        const id = match.params.detalhe;

        console.log({ match })

        try {
            const response = await api.get(`/${id}?api_key=bb877ef70b973ed90e1287cefdcf44f7&language=pt-BR`);
            this.setState({
                repository: response.data,
                loading: false,
            })
            console.log(response.data);
        } catch (err) {
            console.log(err)
        }


    }

    render() {
        const { repository, issues, loading } = this.state;

        if (loading) {
            return <Loading>Carregando</Loading>
        }

        return (
            <Container>
                <Owner>
                    <Link to="/" >Voltar a lista de filmes</Link>
                    <img src={`https://image.tmdb.org/t/p/w500/${repository.poster_path}`} alt={repository.poster_path} />
                    <h1>{repository.title}</h1>
                    <p>{repository.overview}</p>
                </Owner>
            </Container>
        );
    }
}
