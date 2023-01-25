import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import {
  FaUserCircle,
  FaEdit,
  FaWindowClose,
  FaExclamation,
} from 'react-icons/fa';

import { Container } from '../../styles/GlobalStyles';
import { AlunoContainer, ProfilePicture, NovoAluno } from './styled';
import axios from '../../services/axios';

import Loading from '../../components/Loading';
import { toast } from 'react-toastify';

export default function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const permission = useSelector((state) => state.auth.user.permission);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const reponse = await axios.get('/alunos');
      setAlunos(reponse.data);
      setIsLoading(false);
    }

    getData();
  }, []);

  function handleDeleteAsk(e) {
    e.preventDefault();
    const exclamation = e.currentTarget.nextSibling;
    exclamation.setAttribute('display', 'block');
    e.currentTarget.remove();
  }

  const handleDelete = async (e, id, index) => {
    e.persist();

    try {
      setIsLoading(true);
      await axios.delete(`/alunos/${id}`);
      const novosAlunos = [...alunos];
      novosAlunos.splice(index, 1);
      setAlunos(novosAlunos);
      setIsLoading(false);
    } catch (err) {
      const status = get(err, 'response.status', 0);

      if (status === 401) {
        toast.error('Você precisa fazer login');
      } else {
        toast.error('Ocorreu um erro ao excluir aluno');
      }

      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <h1>Alunos</h1>

      {permission === 'Mod' || permission === 'Admin' ? (
        <NovoAluno to="/aluno/">Novo aluno</NovoAluno>
      ) : (
        ''
      )}

      <AlunoContainer>
        {alunos.map((aluno, index) => (
          <div key={String(aluno.id)}>
            <ProfilePicture>
              {get(aluno, 'Fotos[0].url', false) ? (
                <img src={aluno.Fotos[0].url} alt="" />
              ) : (
                <FaUserCircle size={36} />
              )}
            </ProfilePicture>

            <span>{aluno.nome}</span>
            <span>{aluno.email}</span>

            {permission === 'Mod' || permission === 'Admin' ? (
              <Link to={`/aluno/${aluno.id}/edit`}>
                <FaEdit size={16} />
              </Link>
            ) : (
              ''
            )}

            {permission === 'Mod' || permission === 'Admin' ? (
              <Link onClick={handleDeleteAsk} to={`/aluno/${aluno.id}/delete`}>
                <FaWindowClose size={16} />
              </Link>
            ) : (
              ''
            )}

            <FaExclamation
              size={16}
              onClick={(e) => handleDelete(e, aluno.id, index)}
              display="none"
              cursor="pointer"
            />
          </div>
        ))}
      </AlunoContainer>
    </Container>
  );
}
