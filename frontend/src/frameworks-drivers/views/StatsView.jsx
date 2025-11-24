import React from 'react';

const StatsView = ({ players, onPlayerClick, injuryRiskData }) => {
  return (
    <div style={{ 
      minHeight: '100vh',
      padding: '40px',
    }}>
      <div style={{ 
        maxWidth: '1400px',
        marginBottom: '100px', 
        margin: '0 auto',
      }}>
          
        <h2 style={{ 
          color: 'white', 
          fontSize: '32px', 
          fontWeight: 700, 
          marginTop: "-50px",
          marginBottom: '40px',
          textAlign: 'center',
        }}>
          Injury Summary
        </h2>

        {/* Top Stats Grid - 3 boxes per row */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '24px', 
          marginBottom: '30px',
        }}>
          <div style={{ 
            background: 'rgba(139, 101, 132, 0.8)', 
            borderRadius: '16px', 
            padding: '30px', 
            textAlign: 'center', 
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h3 style={{ 
              color: 'white', 
              fontSize: '16px', 
              fontWeight: 600, 
              marginBottom: '15px', 
              opacity: 0.95,
            }}>
              Total injuries this season
            </h3>
            <div style={{ 
              color: 'white', 
              fontSize: '48px', 
              fontWeight: 800, 
              lineHeight: 1,
            }}>
              6
            </div>
          </div>

          <div style={{ 
            background: 'rgba(139, 101, 132, 0.8)', 
            borderRadius: '16px', 
            padding: '30px', 
            textAlign: 'center', 
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h3 style={{ 
              color: 'white', 
              fontSize: '16px', 
              fontWeight: 600, 
              marginBottom: '15px', 
              opacity: 0.95,
            }}>
              Money lost to injuries
            </h3>
            <div style={{ 
              color: 'white', 
              fontSize: '28px', 
              fontWeight: 800, 
              lineHeight: 1,
            }}>
              $20,000,000 - $25,000,000
            </div>
          </div>

          <div style={{ 
            background: 'rgba(139, 101, 132, 0.8)', 
            borderRadius: '16px', 
            padding: '30px', 
            textAlign: 'center', 
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h3 style={{ 
              color: 'white', 
              fontSize: '16px', 
              fontWeight: 600, 
              marginBottom: '15px', 
              opacity: 0.95,
            }}>
              Most common injury
            </h3>
            <div style={{ 
              color: 'white', 
              fontSize: '36px', 
              fontWeight: 800, 
              lineHeight: 1,
            }}>
              Strained Lat
            </div>
          </div>
        </div>

        {/* Bottom Stats Grid - 2 boxes per row */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '24px', 
          marginBottom: '40px',
        }}>
          <div style={{ 
            background: 'rgba(139, 101, 132, 0.8)', 
            borderRadius: '16px', 
            padding: '30px', 
            textAlign: 'center', 
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h3 style={{ 
              color: 'white', 
              fontSize: '16px', 
              fontWeight: 600, 
              marginBottom: '15px', 
              opacity: 0.95,
            }}>
              Total injuries in the last 5 seasons
            </h3>
            <div style={{ 
              color: 'white', 
              fontSize: '48px', 
              fontWeight: 800, 
              lineHeight: 1,
            }}>
              15
            </div>
          </div>

          <div style={{ 
            background: 'rgba(139, 101, 132, 0.8)', 
            borderRadius: '16px', 
            padding: '30px', 
            textAlign: 'center', 
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h3 style={{ 
              color: 'white', 
              fontSize: '16px', 
              fontWeight: 600, 
              marginBottom: '15px', 
              opacity: 0.95,
            }}>
              Days missed to injury
            </h3>
            <div style={{ 
              color: 'white', 
              fontSize: '48px', 
              fontWeight: 800, 
              lineHeight: 1,
            }}>
              1002
            </div>
          </div>
        </div>

        {/* Charts and Lists Section - 3 boxes per row */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '24px', 
          marginBottom: '30px',
        }}>
          {/* Common Injuries Chart */}
          <div style={{ 
            background: 'rgba(160, 115, 142, 0.6)', 
            borderRadius: '16px', 
            padding: '25px', 
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          }}>
            <h3 style={{ 
              color: 'white', 
              fontSize: '20px', 
              fontWeight: 700, 
              marginBottom: '20px', 
              textAlign: 'center',
            }}>
              Common Injuries
            </h3>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-end', 
              justifyContent: 'space-evenly', 
              height: '250px', 
              padding: '10px',
              position: 'relative',
            }}>
              {/* Bar 1 - Strained Lat */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'flex-start',
                justifyContent: 'flex-end',
                position: 'relative',
                height: '100%',
              }}>
                <div style={{ 
                  color: 'white', 
                  fontSize: '18px', 
                  fontWeight: 700,
                  position: 'absolute',
                  top: '0',
                  left: '0',
                }}>
                  15
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                  <div style={{ 
                    width: '60px', 
                    height: '160px', 
                    background: '#e74c3c', 
                    borderRadius: '4px 4px 0 0',
                  }}></div>
                  <div style={{ 
                    color: 'white', 
                    fontSize: '13px', 
                    fontWeight: 600, 
                    textAlign: 'center',
                    marginTop: '8px',
                    lineHeight: '1.3',
                  }}>
                    Strained<br/>Lat
                  </div>
                </div>
              </div>

              {/* Bar 2 - Flexor Strain */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'flex-start',
                justifyContent: 'flex-end',
                position: 'relative',
                height: '100%',
              }}>
                <div style={{ 
                  color: 'white', 
                  fontSize: '18px', 
                  fontWeight: 700,
                  position: 'absolute',
                  top: '50px',
                  left: '5px',
                }}>
                  10
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                  <div style={{ 
                    width: '60px', 
                    height: '110px', 
                    background: '#f1c40f', 
                    borderRadius: '4px 4px 0 0',
                  }}></div>
                  <div style={{ 
                    color: 'white', 
                    fontSize: '13px', 
                    fontWeight: 600, 
                    textAlign: 'center',
                    marginTop: '8px',
                    lineHeight: '1.3',
                  }}>
                    Flexor<br/>Strain
                  </div>
                </div>
              </div>

              {/* Bar 3 - UCL Tear */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'flex-start',
                justifyContent: 'flex-end',
                position: 'relative',
                height: '100%',
                top: "-17px"
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                  <div style={{ 
                    width: '60px', 
                    height: '110px', 
                    background: '#f1c40f', 
                    borderRadius: '4px 4px 0 0',
                  }}></div>
                  <div style={{ 
                    color: 'white', 
                    fontSize: '13px', 
                    fontWeight: 600, 
                    textAlign: 'center',
                    marginTop: '8px',
                    lineHeight: '1.3',
                  }}>
                    UCL Tear
                  </div>
                </div>
              </div>

              {/* Bar 4 - Rotator Cuff */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'flex-start',
                justifyContent: 'flex-end',
                position: 'relative',
                height: '100%',
              }}>
                <div style={{ 
                  color: 'white', 
                  fontSize: '18px', 
                  fontWeight: 700,
                  position: 'absolute',
                  top: '90px',
                  left: '5px',
                }}>
                  5
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                  <div style={{ 
                    width: '60px', 
                    height: '70px', 
                    background: '#2ecc71', 
                    borderRadius: '4px 4px 0 0',
                  }}></div>
                  <div style={{ 
                    color: 'white', 
                    fontSize: '13px', 
                    fontWeight: 600, 
                    textAlign: 'center',
                    marginTop: '8px',
                    lineHeight: '1.3',
                  }}>
                    Rotator<br/>Cuff
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Frequently Injured Pitchers */}
          <div style={{ 
            background: 'rgba(160, 115, 142, 0.6)', 
            borderRadius: '16px', 
            padding: '25px', 
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          }}>
            <h3 style={{ 
              color: 'white', 
              fontSize: '20px', 
              fontWeight: 700, 
              marginBottom: '20px', 
              textAlign: 'center',
            }}>
              Frequently injured pitchers
            </h3>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              margin: 0,
            }}>
              <li style={{ 
                color: 'white', 
                fontSize: '15px', 
                fontWeight: 600, 
                padding: '12px 0', 
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
              }}>
                Ian Hamilton
              </li>
              <li style={{ 
                color: 'white', 
                fontSize: '15px', 
                fontWeight: 600, 
                padding: '12px 0', 
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
              }}>
                Luis Gil
              </li>
              <li style={{ 
                color: 'white', 
                fontSize: '15px', 
                fontWeight: 600, 
                padding: '12px 0',
              }}>
                Clarke Schmidt
              </li>
            </ul>
          </div>

          {/* Recent Injuries */}
          <div style={{ 
            background: 'rgba(160, 115, 142, 0.6)', 
            borderRadius: '16px', 
            padding: '25px', 
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          }}>
            <h3 style={{ 
              color: 'white', 
              fontSize: '20px', 
              fontWeight: 700, 
              marginBottom: '20px', 
              textAlign: 'center',
            }}>
              Recent Injuries
            </h3>
            <div>
              <div style={{ 
                color: 'white', 
                fontSize: '13px', 
                lineHeight: 1.6, 
                marginBottom: '12px',
              }}>
                <strong>Clarke Schmidt:</strong> Tommy John surgery internal brace on 07/04/25
              </div>
              <div style={{ 
                color: 'white', 
                fontSize: '13px', 
                lineHeight: 1.6, 
                marginBottom: '12px',
              }}>
                <strong>Ryan Yarbrough:</strong> Strained oblique on 06/20/25
              </div>
              <div style={{ 
                color: 'white', 
                fontSize: '13px', 
                lineHeight: 1.6, 
                marginBottom: '12px',
              }}>
                <strong>Marcus Stroman:</strong> Knee inflammation on 04/12/25
              </div>
              <div style={{ 
                color: 'white', 
                fontSize: '13px', 
                lineHeight: 1.6, 
                marginBottom: '12px',
              }}>
                <strong>Luis Gil:</strong> Strained lat on 03/27/25
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div style={{ 
          textAlign: 'center', 
          color: 'white', 
          fontSize: '12px', 
          fontStyle: 'italic', 
          marginTop: '40px', 
          opacity: 0.8,
        }}>
          *these statistics are based off of the starter pitchers listed in the dashboard and do not encompass the whole team
        </div>
      </div>
    </div>
  );
};

export default StatsView;